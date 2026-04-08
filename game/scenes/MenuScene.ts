import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, SCENES, COLORS, STARTING_LIVES } from "../constants";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MENU });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.SKY);

    // scrolling clouds
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.image(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(30, 160),
        "cloud"
      ).setAlpha(0.7).setScale(Phaser.Math.FloatBetween(0.6, 1.2));
      this.tweens.add({
        targets: cloud,
        x: cloud.x + 300,
        duration: Phaser.Math.Between(8000, 15000),
        yoyo: true,
        repeat: -1,
      });
    }

    // ground strip
    for (let x = 0; x < GAME_WIDTH; x += 32) {
      this.add.image(x + 16, GAME_HEIGHT - 16, "ground");
    }

    // Title
    this.add.text(GAME_WIDTH / 2, 140, "PIXEL\nPLUMBER", {
      fontSize: "48px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6,
      align: "center",
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, 260, "A Next.js Platformer", {
      fontSize: "12px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#ffd700",
    }).setOrigin(0.5);

    // Player preview
    this.add.image(GAME_WIDTH / 2, 340, "player").setScale(3);

    // Blinking "press to start"
    const startText = this.add.text(GAME_WIDTH / 2, 440, "PRESS ENTER OR TAP TO START", {
      fontSize: "11px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#ffffff",
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Controls info
    this.add.text(GAME_WIDTH / 2, 500, "← → MOVE    ↑ / SPACE JUMP", {
      fontSize: "9px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#aaaaaa",
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 530, "STOMP ENEMIES · COLLECT COINS · REACH THE FLAG!", {
      fontSize: "7px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#888888",
    }).setOrigin(0.5);

    // copyright
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 20, "© 2026 Pixel Plumber – Built with Next.js + Phaser 3", {
      fontSize: "6px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#555555",
    }).setOrigin(0.5);

    // Input
    this.input.keyboard?.once("keydown-ENTER", () => this.startGame());
    this.input.keyboard?.once("keydown-SPACE", () => this.startGame());
    this.input.once("pointerdown", () => this.startGame());
  }

  private startGame(): void {
    this.scene.stop(SCENES.HUD);
    this.scene.start(SCENES.GAME);
  }
}
