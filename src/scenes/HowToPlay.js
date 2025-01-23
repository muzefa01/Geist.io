import { Scene } from "phaser";

export class HowToPlay extends Scene {
  constructor() {
    super("HowToPlay");
  }
  preload() {
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );
    this.load.image("blackboard", "/assets/geist-blackboard.png");
    this.load.image("home", "/assets/geist-home-button.png");
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

    const add = this.add;

    WebFont.load({
      google: {
        families: ["Jacquard 12", "Cabin Sketch"],
      },
      active: function () {
        add.text(282, 135, "how to play", {
          fontFamily: '"Jacquard 12", serif',
          fontSize: 60,
          color: "#ffffff",
          fontStyle: "normal",
        });
        add.text(
          130,
          240,
          "There is an imbalance in the spirit world.\n\nYou must select a team of spirit fighters and do battle against your opponent.\n\nA spirit is randomly generated for you, click resummon to generate a new one.\n\nEach round, take it in turns to select which spirits fight.\n\nThe spirit with the best stats wins.\n\nGood luck!",
          {
            fontFamily: "Cabin Sketch",
            fontSize: 15,
            color: "#ffffff",
            fontStyle: "normal",
          }
        );
      },
    });
    const blackboard = this.add.image(412, 390, "blackboard");

    blackboard.setScale(1.7);

    // const home = this.add.image(600, 500, "home").setInteractive();
    // home
    //   .setScale(0.4)
    //   .on("pointerdown", () => {
    //     this.scene.start("Preloader");
    //   })
    //   .on("pointerover", () => {
    //     home.setScale(0.42).setTint(0xca7dff);
    //   })
    //   .on("pointerout", () => {
    //     home.setScale(0.4).clearTint();
    //   });
  }
  update() {
    this.bg.tilePositionY += 0.5;
  }
}
