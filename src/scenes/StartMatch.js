import { Scene } from "phaser";
import { CharBody } from "../charBody";
import { io } from "socket.io-client";
// const room = getQueryParameter("room") || getRandomString(5);
// window.history.replaceState(
//   {},
//   document.title,
//   updateQueryParameter("room", room)
// );

let room = 3000;
const rand = Math.random;

export class StartMatch extends Scene {
  constructor() {
    super("StartMatch");
  }
  preload() {
    this.socket = io();
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );
    this.socket = io()
    this.load.image("copy", "/assets/geist-copy.png");
    this.load.image("resummon", "/assets/geist-resummon.png");
    this.load.image("placeholder", "/assets/geist-placeholder.png");
    this.load.image("stats", "/assets/geist-stats.png");
    this.load.image("head1", "assets/head1.png");
    this.load.image("start-match", "assets/geiststartmatch.png");
  }

  create() {
    //start match button

    //join match functionality
    const add = this.add;

    this.socket.on('log', (msg) => {
      console.log("MSG: "+ msg)
    })

    this.socket.on('yourRoomIs', (roomCode) => {
      room = roomCode
      console.log(room)
    })
    

    this.bg = this.add
      .tileSprite(0, 0, 1280, 720, "background")
      .setOrigin(0)
      .setScrollFactor(0, 1);

    this.btnCreateRoom = this.add.text(100, 100, "createRoom", {
      fill: "#FFFFFF",
    });
    this.btnCreateRoom.setInteractive();
    this.btnCreateRoom
      .on("pointerdown", () => {
        this.socket.emit("createRoom");
        this.btnCreateRoom.setStyle({ fill: "#FF00FF" });
      })
      .on("pointerup", () => {
        this.btnCreateRoom.setStyle({ fill: "#FFFFFF" });
      });

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
        add.text(285, 160, `your match code is ${"no"}`, {
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

    this.placeholder = this.testChar = new CharBody(
      this,
      { x: 412, y: 580 },
      {
        height: 150 + rand() * 120, // HP, SPD
        bodyWidth: 30 + rand() * 30, // HP, DEF
        neckBaseRatio: 0.28 + rand() * 0.37, // DEF
        leanForward: rand() ** 2 * 20, // ATK
        neckType: 1, // DEF

        armLengthRatio: 0.5 + rand() * 0.2, // SPD
        armWidthRatio: 0.35 + rand() * 0.3, // ATK, DEF
        weaponGrip: 1, // ATK, SPD

        animSpeed: 0.8 + rand() * 0.4,

        weaponType: 1,
        headType: 1,
      }
    );

    const statsBox = this.add.image(150, 400, "stats").setScale(2.2);

    const stats = this.add.text(
      80,
      300,
      "attack = 5\n\ndefence = 6\n\nhp = 25\n\nspeed = 7"
    );

    this.btnCreateRoom = this.add.text(100, 100, 'createRoom', {fill: '#FFFFFF'})
    this.btnCreateRoom.setInteractive()
    this.btnCreateRoom.on('pointerdown', () => {
      this.socket.emit('createRoom')
      this.btnCreateRoom.setStyle({fill: '#FF00FF'})
    }).on('pointerup', () => {this.btnCreateRoom.setStyle({fill: '#FFFFFF'})})
  }

  update() {
    this.bg.tilePositionY += 0.5;
    this.placeholder.frameAdvance();
  }
}
