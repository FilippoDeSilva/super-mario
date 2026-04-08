import Phaser from "phaser";
import { SCENES } from "../constants";
import { generateTextures } from "../utils/textures";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  create(): void {
    generateTextures(this);
    this.scene.start(SCENES.MENU);
  }
}
