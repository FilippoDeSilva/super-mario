import Phaser from "phaser";
import {
  TILE, GRAVITY, PLAYER_SPEED, PLAYER_JUMP, ENEMY_SPEED,
  COIN_SCORE, ENEMY_SCORE, SCENES, COLORS, GAME_WIDTH, GAME_HEIGHT,
  LEVEL_1, LEVEL_COMPLETE_SCORE, LEVEL_TIME,
} from "../constants";

interface EnemyWithDir extends Phaser.Physics.Arcade.Sprite {
  direction: number;
}

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private grounds!: Phaser.Physics.Arcade.StaticGroup;
  private bricks!: Phaser.Physics.Arcade.StaticGroup;
  private questions!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private pipes!: Phaser.Physics.Arcade.StaticGroup;
  private flagPole!: Phaser.Physics.Arcade.Sprite;
  private levelWidth = 0;
  private isLevelComplete = false;
  private isDead = false;
  private timerEvent!: Phaser.Time.TimerEvent;

  // Touch controls
  private touchLeft = false;
  private touchRight = false;
  private touchJump = false;

  constructor() {
    super({ key: SCENES.GAME });
  }

  create(): void {
    this.isLevelComplete = false;
    this.isDead = false;
    this.touchLeft = false;
    this.touchRight = false;
    this.touchJump = false;

    const map = LEVEL_1;
    this.levelWidth = map[0].length * TILE;

    // ── Sky ───────────────────────────────────────
    this.cameras.main.setBackgroundColor(COLORS.SKY);

    // ── Parallax decorations ──────────────────────
    this.addDecorations();

    // ── Groups ────────────────────────────────────
    this.grounds = this.physics.add.staticGroup();
    this.bricks = this.physics.add.staticGroup();
    this.questions = this.physics.add.staticGroup();
    this.coins = this.physics.add.group({ allowGravity: false });
    this.enemies = this.physics.add.group();
    this.pipes = this.physics.add.staticGroup();

    // ── Build level from string map ───────────────
    let playerStart = { x: 100, y: 400 };
    let flagPos = { x: 0, y: 0 };

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const x = col * TILE + TILE / 2;
        const y = row * TILE + TILE / 2;
        const ch = map[row][col];

        switch (ch) {
          case "G":
            this.grounds.create(x, y, "ground");
            break;
          case "B":
            this.bricks.create(x, y, "brick");
            break;
          case "?":
            this.questions.create(x, y, "question");
            break;
          case "C": {
            const coin = this.coins.create(x, y, "coin") as Phaser.Physics.Arcade.Sprite;
            this.tweens.add({
              targets: coin,
              y: y - 6,
              duration: 600,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            });
            break;
          }
          case "E": {
            const enemy = this.enemies.create(x, y - 4, "enemy") as EnemyWithDir;
            enemy.direction = -1;
            enemy.setBounce(0);
            enemy.setCollideWorldBounds(false);
            const body = enemy.body as Phaser.Physics.Arcade.Body;
            body.setSize(TILE - 4, TILE - 4);
            break;
          }
          case "T":
            this.pipes.create(x + TILE / 2, y, "pipe_top");
            break;
          case "P":
            this.pipes.create(x + TILE / 2, y, "pipe_body");
            break;
          case "S":
            playerStart = { x, y };
            break;
          case "F":
            flagPos = { x, y };
            break;
          default:
            break;
        }
      }
    }

    // ── Flag ──────────────────────────────────────
    for (let i = 0; i < 5; i++) {
      this.add.image(flagPos.x, flagPos.y - (i * TILE), "flag_pole");
    }
    this.add.image(flagPos.x - 10, flagPos.y - 5 * TILE + 8, "flag").setScale(1.2);
    this.flagPole = this.physics.add.sprite(flagPos.x, flagPos.y - 2 * TILE, "flag_pole")
      .setAlpha(0)
      .setImmovable(true);
    (this.flagPole.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    (this.flagPole.body as Phaser.Physics.Arcade.Body).setSize(TILE, TILE * 5);

    // ── Player ────────────────────────────────────
    this.player = this.physics.add.sprite(playerStart.x, playerStart.y, "player");
    this.player.setBounce(0.05);
    this.player.setCollideWorldBounds(false);
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setSize(20, 30);
    playerBody.setOffset(6, 2);

    // ── Camera ────────────────────────────────────
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, this.levelWidth, GAME_HEIGHT);
    this.physics.world.setBounds(0, 0, this.levelWidth, GAME_HEIGHT + 200);

    // ── Collisions ────────────────────────────────
    this.physics.add.collider(this.player, this.grounds);
    this.physics.add.collider(this.player, this.pipes);
    this.physics.add.collider(this.enemies, this.grounds);
    this.physics.add.collider(this.enemies, this.pipes);
    this.physics.add.collider(this.enemies, this.enemies);

    // Brick collision
    this.physics.add.collider(
      this.player,
      this.bricks,
      this.hitBrick as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    // Question block collision
    this.physics.add.collider(
      this.player,
      this.questions,
      this.hitQuestion as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    // Coin overlap
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    // Enemy overlap
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.enemyContact as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    // Flag overlap
    this.physics.add.overlap(
      this.player,
      this.flagPole,
      this.reachFlag as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );

    // ── Input ─────────────────────────────────────
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // ── HUD scene ─────────────────────────────────
    if (!this.scene.isActive(SCENES.HUD)) {
      this.scene.launch(SCENES.HUD);
    }

    // ── Registry initialization ───────────────────────
    // Small delay to ensure HUD scene is fully initialized
    this.time.delayedCall(100, () => {
      // Only initialize if values don't exist (fresh game from menu)
      if (this.registry.get("time") === undefined) {
        this.registry.set("time", LEVEL_TIME);
        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("lives", 3);
      }
    });
    
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true,
    });

    // ── Touch controls ────────────────────────────
    this.createTouchControls();
  }

  update(): void {
    if (this.isLevelComplete || this.isDead) return;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const onFloor = body.blocked.down || body.touching.down;

    // ── Horizontal movement ───────────────────────
    const left = this.cursors.left.isDown || this.touchLeft;
    const right = this.cursors.right.isDown || this.touchRight;
    const jump = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                 Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
                 this.touchJump;

    if (left) {
      this.player.setVelocityX(-PLAYER_SPEED);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.setVelocityX(PLAYER_SPEED);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    // ── Jump ──────────────────────────────────────
    if (jump && onFloor) {
      this.player.setVelocityY(PLAYER_JUMP);
      this.touchJump = false;
    }

    // ── Texture swap ──────────────────────────────
    if (!onFloor) {
      this.player.setTexture("player_jump");
    } else {
      this.player.setTexture("player");
    }

    // ── Enemy patrol ──────────────────────────────
    this.enemies.getChildren().forEach((obj) => {
      const e = obj as EnemyWithDir;
      if (!e.active) return;
      const eb = e.body as Phaser.Physics.Arcade.Body;

      if (eb.blocked.left) e.direction = 1;
      if (eb.blocked.right) e.direction = -1;
      e.setVelocityX(ENEMY_SPEED * e.direction);
    });

    // ── Fell off the world ────────────────────────
    if (this.player.y > GAME_HEIGHT + 50) {
      this.playerDie();
    }
  }

  /* ────────────────────────────────────────────────
   * Interactions
   * ──────────────────────────────────────────────── */

  private hitBrick(
    _player: Phaser.GameObjects.GameObject,
    brick: Phaser.GameObjects.GameObject,
  ): void {
    const p = this.player.body as Phaser.Physics.Arcade.Body;
    if (p.velocity.y >= 0) return;

    const b = brick as Phaser.Physics.Arcade.Sprite;
    for (let i = 0; i < 4; i++) {
      const part = this.add.image(b.x + Phaser.Math.Between(-8, 8), b.y, "brick_particle");
      this.tweens.add({
        targets: part,
        x: part.x + Phaser.Math.Between(-60, 60),
        y: part.y - Phaser.Math.Between(40, 120),
        alpha: 0,
        angle: Phaser.Math.Between(-360, 360),
        duration: 500,
        onComplete: () => part.destroy(),
      });
    }
    b.destroy();
  }

  private hitQuestion(
    _player: Phaser.GameObjects.GameObject,
    block: Phaser.GameObjects.GameObject,
  ): void {
    const p = this.player.body as Phaser.Physics.Arcade.Body;
    if (p.velocity.y >= 0) return;

    const b = block as Phaser.Physics.Arcade.Sprite;

    if (b.getData("used")) return;

    this.tweens.add({
      targets: b,
      y: b.y - 8,
      duration: 80,
      yoyo: true,
    });

    const coinUp = this.add.image(b.x, b.y - TILE, "coin");
    this.tweens.add({
      targets: coinUp,
      y: coinUp.y - 60,
      alpha: 0,
      duration: 600,
      onComplete: () => coinUp.destroy(),
    });

    const score = (this.registry.get("score") as number) + COIN_SCORE;
    const coinCount = (this.registry.get("coins") as number) + 1;
    this.registry.set("score", score);
    this.registry.set("coins", coinCount);

    b.setTint(0x888888);
    b.setData("used", true);
  }

  private collectCoin(
    _player: Phaser.GameObjects.GameObject,
    coin: Phaser.GameObjects.GameObject,
  ): void {
    const c = coin as Phaser.Physics.Arcade.Sprite;
    c.disableBody(true, true);

    const score = (this.registry.get("score") as number) + COIN_SCORE;
    const coins = (this.registry.get("coins") as number) + 1;
    this.registry.set("score", score);
    this.registry.set("coins", coins);

    const txt = this.add.text(c.x, c.y - 10, `${COIN_SCORE}`, {
      fontSize: "12px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#ffffff",
    }).setOrigin(0.5);
    this.tweens.add({
      targets: txt,
      y: txt.y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => txt.destroy(),
    });
  }

  private enemyContact(
    _player: Phaser.GameObjects.GameObject,
    enemy: Phaser.GameObjects.GameObject,
  ): void {
    const e = enemy as Phaser.Physics.Arcade.Sprite;
    if (!e.active) return;
    const pb = this.player.body as Phaser.Physics.Arcade.Body;

    if (pb.velocity.y > 0 && this.player.y < e.y - 10) {
      this.player.setVelocityY(PLAYER_JUMP * 0.6);
      e.setTexture("enemy_flat");
      e.body!.enable = false;
      const score = (this.registry.get("score") as number) + ENEMY_SCORE;
      this.registry.set("score", score);

      const txt = this.add.text(e.x, e.y - 20, `${ENEMY_SCORE}`, {
        fontSize: "12px",
        fontFamily: '"Press Start 2P", monospace',
        color: "#ffffff",
      }).setOrigin(0.5);
      this.tweens.add({ targets: txt, y: txt.y - 40, alpha: 0, duration: 800, onComplete: () => txt.destroy() });

      this.time.delayedCall(400, () => e.destroy());
    } else {
      this.playerDie();
    }
  }

  private reachFlag(): void {
    if (this.isLevelComplete) return;
    this.isLevelComplete = true;
    this.timerEvent.remove();

    this.player.setVelocityX(0);
    this.player.setVelocityY(0);
    (this.player.body as Phaser.Physics.Arcade.Body).allowGravity = false;

    const score = (this.registry.get("score") as number) + LEVEL_COMPLETE_SCORE;
    this.registry.set("score", score);

    this.tweens.add({
      targets: this.player,
      y: this.player.y + 100,
      duration: 1000,
      onComplete: () => {
        this.time.delayedCall(800, () => {
          this.scene.stop(SCENES.HUD);
          this.scene.start(SCENES.WIN);
        });
      },
    });
  }

  private playerDie(): void {
    if (this.isDead) return;
    this.isDead = true;
    this.timerEvent.remove();

    this.player.setTint(0xff0000);
    this.player.setVelocityX(0);
    this.player.setVelocityY(PLAYER_JUMP * 0.8);

    this.time.delayedCall(1500, () => {
      const lives = (this.registry.get("lives") as number) - 1;
      this.registry.set("lives", lives);
      this.scene.stop(SCENES.HUD);
      if (lives <= 0) {
        this.scene.start(SCENES.OVER);
      } else {
        this.scene.restart();
      }
    });
  }

  private tickTimer(): void {
    const t = (this.registry.get("time") as number) - 1;
    this.registry.set("time", t);
    if (t <= 0) {
      this.playerDie();
    }
  }

  /* ────────────────────────────────────────────────
   * Decorations
   * ──────────────────────────────────────────────── */
  private addDecorations(): void {
    for (let i = 0; i < 20; i++) {
      this.add.image(i * 400 + Phaser.Math.Between(0, 200), Phaser.Math.Between(30, 120), "cloud")
        .setScrollFactor(0.2)
        .setAlpha(0.7)
        .setScale(Phaser.Math.FloatBetween(0.8, 1.4));
    }
    for (let i = 0; i < 12; i++) {
      this.add.image(i * 600 + Phaser.Math.Between(0, 200), GAME_HEIGHT - 80, "hill")
        .setScrollFactor(0.4)
        .setScale(Phaser.Math.FloatBetween(1, 2));
    }
    for (let i = 0; i < 18; i++) {
      this.add.image(i * 350 + Phaser.Math.Between(0, 150), GAME_HEIGHT - 48, "bush")
        .setScrollFactor(0.6);
    }
  }

  /* ────────────────────────────────────────────────
   * Touch Controls
   * ──────────────────────────────────────────────── */
  private createTouchControls(): void {
    const btnAlpha = 0.35;
    const btnSize = 56;
    const pad = 20;
    const bottomY = GAME_HEIGHT - pad - btnSize / 2;

    const leftBtn = this.add.circle(pad + btnSize / 2, bottomY, btnSize / 2, 0xffffff, btnAlpha)
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(100);
    this.add.text(pad + btnSize / 2, bottomY, "◀", { fontSize: "24px", color: "#000" })
      .setOrigin(0.5).setScrollFactor(0).setDepth(101);

    leftBtn.on("pointerdown", () => { this.touchLeft = true; });
    leftBtn.on("pointerup", () => { this.touchLeft = false; });
    leftBtn.on("pointerout", () => { this.touchLeft = false; });

    const rightBtn = this.add.circle(pad + btnSize * 1.7, bottomY, btnSize / 2, 0xffffff, btnAlpha)
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(100);
    this.add.text(pad + btnSize * 1.7, bottomY, "▶", { fontSize: "24px", color: "#000" })
      .setOrigin(0.5).setScrollFactor(0).setDepth(101);

    rightBtn.on("pointerdown", () => { this.touchRight = true; });
    rightBtn.on("pointerup", () => { this.touchRight = false; });
    rightBtn.on("pointerout", () => { this.touchRight = false; });

    const jumpBtn = this.add.circle(GAME_WIDTH - pad - btnSize / 2, bottomY, btnSize / 2, 0xffdd00, btnAlpha)
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(100);
    this.add.text(GAME_WIDTH - pad - btnSize / 2, bottomY, "▲", { fontSize: "24px", color: "#000" })
      .setOrigin(0.5).setScrollFactor(0).setDepth(101);

    jumpBtn.on("pointerdown", () => { this.touchJump = true; });
    jumpBtn.on("pointerup", () => { this.touchJump = false; });
    jumpBtn.on("pointerout", () => { this.touchJump = false; });
  }
}
