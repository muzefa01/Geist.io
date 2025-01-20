import { scene } from "phaser";

export class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("background", "/assets/geist-bg.png");
  }

  create() {
    console.log();
    this.scene.start("Preloader");
  }
}
