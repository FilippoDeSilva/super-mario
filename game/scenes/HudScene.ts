import Phaser from "phaser";
import { GAME_WIDTH, SCENES } from "../constants";

export default class HudScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private coinText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private worldText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENES.HUD });
  }

  create(): void {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: "12px",
      fontFamily: '"Press Start 2P", monospace',
      color: "#ffffff",
    };

    const y = 12;
    this.add.text(16, y, "SCORE", { ...style, fontSize: "8px", color: "#cccccc" });
    this.scoreText = this.add.text(16, y + 14, "000000", style);

    this.add.text(170, y, "COINS", { ...style, fontSize: "8px", color: "#cccccc" });
    this.coinText = this.add.text(170, y + 14, "×00", style);

    this.add.text(GAME_WIDTH / 2 - 30, y, "WORLD", { ...style, fontSize: "8px", color: "#cccccc" });
    this.worldText = this.add.text(GAME_WIDTH / 2 - 30, y + 14, "1-1", style);

    this.add.text(GAME_WIDTH - 180, y, "LIVES", { ...style, fontSize: "8px", color: "#cccccc" });
    this.livesText = this.add.text(GAME_WIDTH - 180, y + 14, "×3", style);

    this.add.text(GAME_WIDTH - 80, y, "TIME", { ...style, fontSize: "8px", color: "#cccccc" });
    this.timeText = this.add.text(GAME_WIDTH - 80, y + 14, "300", style);

    // Listen to registry changes
    this.registry.events.on("changedata", this.updateHud, this);
    this.updateHud();
  }

  private updateHud(): void {
    const score = (this.registry.get("score") as number) || 0;
    const coins = (this.registry.get("coins") as number) || 0;
    const lives = (this.registry.get("lives") as number) || 0;
    const time = (this.registry.get("time") as number) || 0;

    if (this.scoreText) this.scoreText.setText(score.toString().padStart(6, "0"));
    if (this.coinText) this.coinText.setText(`×${coins.toString().padStart(2, "0")}`);
    if (this.livesText) this.livesText.setText(`×${lives}`);
    if (this.timeText) this.timeText.setText(time.toString());
  }

  shutdown(): void {
    this.registry.events.off("changedata", this.updateHud, this);
  }
}
