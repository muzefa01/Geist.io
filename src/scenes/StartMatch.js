import { Scene } from "phaser";
import { CharBody } from "../charBody";
import { io } from "socket.io-client";

let room = "";
const rand = Math.random;

export class StartMatch extends Scene {
  constructor() {
    super("StartMatch");
  }
  preload() {
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );
    this.socket = io('https://geist-io.onrender.com/');
    this.load.image("copy", "/assets/geist-copy.png");
    this.load.image("resummon", "/assets/geist-resummon.png");
    this.load.image("stats", "/assets/geist-stats.png");
    this.load.image("head1", "assets/head1.png");
    this.load.image("start-match", "assets/geiststartmatch.png");
    this.load.image("create-match", "assets/geist-create-match.png");
    this.load.image("join-match", "assets/geist-join-match.png");
  }

  create() {
    WebFont.load({
      google: {
        families: ["IM Fell English"],
      },
    });

    const add = this.add;

    this.bg = this.add
      .tileSprite(0, 0, 1280, 720, "background")
      .setOrigin(0)
      .setScrollFactor(0, 1);

    //start match button
    this.socket.on("yourRoomIs", (roomCode) => {
      room = roomCode;
      console.log(room);
      this.text1 = this.add
        .text(285, 160, `your match code is ${room}`, {
          fontFamily: '"IM Fell English", serif',
          fontSize: 20,
          color: "#ffffff",
          fontStyle: "normal",
        })
        .setVisible(true);
    });

    this.socket.on("offerSpirit", (spirit, mode, index) => {
      if(mode === "start"){
        console.log(spirit)
      }
    })

    this.btnCreateRoom = this.add.image(412, 250, "create-match");
    this.btnCreateRoom.setInteractive({ useHandCursor: true });
    this.btnCreateRoom
      .on("pointerover", () => {
        this.btnCreateRoom.setScale(1.05).setTint(0xca7dff);
      })
      .on("pointerout", () => {
        this.btnCreateRoom.setScale(1).clearTint();
      })
      .on("pointerdown", () => {
        this.socket.emit("createRoom");
        this.btnCreateRoom.setVisible(false);
        this.joinMatchBtn.setVisible(false);
        this.add
          .text(270, 200, `copy and send to a friend to begin`, {
            fontFamily: '"IM Fell English", serif',
            fontSize: 20,
            color: "#ffffff",
            fontStyle: "normal",
          })
          .setVisible(true);
        copyButton.setVisible(true);
        this.placeholder.show();
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

    const copyButton = this.add
      .image(525, 170, "copy")
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

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

    //join match
    this.joinMatchBtn = this.add.image(412, 380, "join-match");
    this.joinMatchBtn.setInteractive({ useHandCursor: true });
    this.joinMatchBtn
      .on("pointerover", () => {
        this.joinMatchBtn.setScale(1.05).setTint(0xca7dff);
      })
      .on("pointerout", () => {
        this.joinMatchBtn.setScale(1).clearTint();
      })
      .on("pointerdown", () => {
        this.btnCreateRoom.setVisible(false);
        this.joinMatchBtn.setVisible(false);
        this.add
          .text(265, 160, `to join a match, enter code below`, {
            fontFamily: '"IM Fell English", serif',
            fontSize: 20,
            color: "#ffffff",
            fontStyle: "normal",
          })
          .setVisible(true);
        this.placeholder.show();
        this.txtJoinRoon = this.add.dom(375, 210).createFromHTML(`
          <input type="text" id="codeText" name="codeText" placeholder="Room Code" style="font-size: 15px">
          `);
        this.btnJoinRoom = this.add
          .text(480, 195, `join`, {
            fontFamily: '"IM Fell English", serif',
            fontSize: 20,
            color: "#ffffff",
            fontStyle: "normal",
          })
          .setInteractive({ useHandCursor: true });
        this.btnJoinRoom
          .on("pointerdown", () => {
            this.socket.emit(
              "joinRoom",
              document.getElementById("codeText").value
            );
            this.btnJoinRoom.setStyle({ fill: "#FF00FF" });
          })
          .on("pointerup", () => {
            this.btnJoinRoom.setStyle({ fill: "#FFFFFF" });
          });
      });

    // const resummon = this.add
    //   .image(680, 400, "resummon")
    //   .setScale(0.5)
    //   .setInteractive({ useHandCursor: true });

    // resummon
    //   .on("pointerdown", () => {
    //     resummon.setTint(0xc6c6c6);
    //     this.scene.start("Game");
    //   })
    //   .on("pointerup", () => {
    //     resummon.clearTint();
    //   });

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

    this.placeholder.hide();
  }

  update() {
    this.bg.tilePositionY += 0.5;
    this.placeholder.frameAdvance();
  }
}
