import { Scene } from "phaser";
import { io } from "socket.io-client";
import { getQueryParameter } from "../utils";
import { getRandomString } from "../utils";
import { updateQueryParameter } from "../utils";

// const room = getQueryParameter("room") || getRandomString(5);
// window.history.replaceState(
//   {},
//   document.title,
//   updateQueryParameter("room", room)
// );

const room = 3000

export class StartMatch extends Scene {
  constructor() {
    super("StartMatch");
  }
  preload() {
    // this.socket = io(`localhost:3000?room=${room}`);
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
    const add = this.add;

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

    WebFont.load({
      google: {
        families: ["IM Fell English"],
      },
      active: function () {
        add.text(285, 160, `your match code is ${room}`, {
          fontFamily: '"IM Fell English", serif',
          fontSize: 20,
          color: "#ffffff",
          fontStyle: "normal",
        }),
          add.text(265, 200, `copy and send to a friend to begin`, {
            fontFamily: '"IM Fell English", serif',
            fontSize: 20,
            color: "#ffffff",
            fontStyle: "normal",
          });
      },
    });
    const copyButton = this.add
      .image(515, 170, "copy")
      .setInteractive({ useHandCursor: true });

    copyButton
      .on("pointerdown", () => {
        navigator.clipboard.writeText(room).then(
          () => {
            console.log("content copied successfully");
          },
          () => {
            console.error("Failed to copy");
          }
        );
        copyButton.setTint(0xca7dff);
      })
      .on("pointerup", () => {
        copyButton.clearTint();
      });

    const resummon = this.add
      .image(680, 400, "resummon")
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });

    resummon
      .on("pointerdown", () => {
        resummon.setTint(0xc6c6c6);
        this.scene.start("Game");
      })
      .on("pointerup", () => {
        resummon.clearTint();
      });

    const placeholder = this.add.image(412, 380, "placeholder").setScale(1.5);

    const statsBox = this.add.image(150, 400, "stats").setScale(2.2);

    const stats = this.add.text(
      80,
      300,
      "attack=5\n\ndefense=6\n\nhp=25\n\nspeed=7"
    );
  }
  update() {
    this.bg.tilePositionY += 0.5;
  }
}
