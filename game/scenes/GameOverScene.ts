import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, SCENES, COLORS } from "../constants";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.OVER });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x000000);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, "GAME OVER", {
      fontSize: "36px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#ff4444",
      stroke: "#000000",
      strokeThickness: 4,
    }).setOrigin(0.5);

    const score = this.registry.get("score") as number;
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, `FINAL SCORE: ${score}`, {
      fontSize: "14px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#ffffff",
    }).setOrigin(0.5);

    const retry = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, "PRESS ENTER TO RETRY", {
      fontSize: "11px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#ffd700",
    }).setOrigin(0.5);

    this.tweens.add({ targets: retry, alpha: 0, duration: 500, yoyo: true, repeat: -1 });

    this.input.keyboard?.once("keydown-ENTER", () => this.scene.start(SCENES.MENU));
    this.input.keyboard?.once("keydown-SPACE", () => this.scene.start(SCENES.MENU));
    this.input.once("pointerdown", () => this.scene.start(SCENES.MENU));
  }
}
