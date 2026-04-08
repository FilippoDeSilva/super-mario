import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, SCENES } from "../constants";

export default class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.WIN });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x000000);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, "★ LEVEL COMPLETE! ★", {
      fontSize: "24px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#00ff00",
      stroke: "#000000",
      strokeThickness: 4,
    }).setOrigin(0.5);

    const score = this.registry.get("score") as number;
    const coins = this.registry.get("coins") as number;
    const time = this.registry.get("time") as number;

    const infoStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: "12px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#ffffff",
    };

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, `SCORE: ${score}`, infoStyle).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, `COINS: ${coins}`, infoStyle).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, `TIME BONUS: ${time * 10}`, infoStyle).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, `TOTAL: ${score + time * 10}`, {
      ...infoStyle,
      color: "#ffd700",
      fontSize: "16px",
    }).setOrigin(0.5);

    // Firework particles
    for (let i = 0; i < 30; i++) {
      const px = Phaser.Math.Between(50, GAME_WIDTH - 50);
      const py = Phaser.Math.Between(50, GAME_HEIGHT - 100);
      const p = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT, "particle").setScale(2);
      this.tweens.add({
        targets: p,
        x: px,
        y: py,
        alpha: 0,
        duration: Phaser.Math.Between(1000, 2500),
        delay: Phaser.Math.Between(0, 1500),
        onComplete: () => p.destroy(),
      });
    }

    const cont = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50, "PRESS ENTER FOR MENU", {
      fontSize: "10px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#aaaaaa",
    }).setOrigin(0.5);
    this.tweens.add({ targets: cont, alpha: 0, duration: 500, yoyo: true, repeat: -1 });

    this.input.keyboard?.once("keydown-ENTER", () => this.scene.start(SCENES.MENU));
    this.input.keyboard?.once("keydown-SPACE", () => this.scene.start(SCENES.MENU));
    this.input.once("pointerdown", () => this.scene.start(SCENES.MENU));
  }
}
