import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  preload() {
    this.load.image("start-game", "/assets/geist-start-game.png");

    this.load.image("join-match", "/assets/geist-join-arena.png");

    this.load.image("how-to", "/assets/geist-h2p.png");
  }

  create() {
    this.background = this.add
      .tileSprite(0, 0, 1280, 720, "background")
      .setOrigin(0.1)
      .setScrollFactor(0, 1);

    this.add.image(412, 110, "logo");

    const startMatchButton = this.add
      .image(412, 270, "start-game")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startMatchButton
      .on("pointerover", () => {
        startMatchButton.setScale(1.05).setTint(0xca7dff);
      })
      .on("pointerout", () => {
        startMatchButton.setScale(1).clearTint();
      })
      .on("pointerdown", () => {
        this.scene.start("StartMatch");
      });

    const joinMatchButton = this.add
      .image(412, 400, "join-match")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    joinMatchButton
      .on("pointerdown", () => {
        this.scene.start("JoinMatch");
      })
      .on("pointerover", () => {
        joinMatchButton.setScale(1.05).setTint(0xca7dff);
      })
      .on("pointerout", () => {
        joinMatchButton.setScale(1).clearTint();
      });

    const howToButton = this.add
      .image(412, 520, "how-to")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    howToButton
      .on("pointerdown", () => {
        this.scene.start("HowToPlay");
      })
      .on("pointerover", () => {
        howToButton.setScale(1.05).setTint(0xca7dff);
      })
      .on("pointerout", () => {
        howToButton.setScale(1).clearTint();
      });
  }
  update() {
    this.background.tilePositionY += 0.5;
  }
}
