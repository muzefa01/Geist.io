import { Scene } from "phaser";

export class JoinMatch extends Scene {
  constructor() {
    super("JoinMatch");
  }
  preload() {
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );
    this.load.image("copy", "/assets/geist-copy.png");
    this.load.image("resummon", "/assets/geist-resummon.png");
    this.load.image("placeholder", "/assets/geist-placeholder.png");
    this.load.image("stats", "/assets/geist-stats.png");
  }

  create() {

    this.bg = this.add
      .tileSprite(0, 0, 1280, 720, "background")
      .setOrigin(0)
      .setScrollFactor(0, 1);

    const logo = this.add
      .image(412, 80, "logo")
      .setInteractive({ useHandCursor: true });

    logo
      .on("pointerdown", () => {
        this.scene.start("Preloader");
      })
      .on("pointerover", () => {
        logo.setScale(1.05).setTint(0xca7dff);
      })
      .on("pointerout", () => {
        logo.setScale(1).clearTint();
      });

    const roomcode = "XY76";

    WebFont.load({
      google: {
        families: ["IM Fell English"],
      },
      active: function () {
        add.text(285, 160, `to join a match, enter code below`, {
          fontFamily: '"IM Fell English", serif',
          fontSize: 20,
          color: "#ffffff",
          fontStyle: "normal",
        });
      },
    });

    const resummon = this.add
      .image(680, 400, "resummon")
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });

    resummon
      .on("pointerdown", () => {
        resummon.setTint(0xc6c6c6);
      })
      .on("pointerup", () => {
        resummon.clearTint();
      });

    const placeholder = this.add.image(412, 380, "placeholder").setScale(1.5);

    const statsBox = this.add.image(150, 400, "stats").setScale(2.2);

    const stats = this.add.text(
      80,
      300,
      "attack = 5\n\ndefence = 6\n\nhp = 25\n\nspeed = 7"
    );
  }
  update() {
    this.bg.tilePositionY += 0.5;
  }
}
