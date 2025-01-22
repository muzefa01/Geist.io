import { Scene } from "phaser";
import { CharBody } from "../charBody";
import { io } from "socket.io-client";
import { GameState } from "../gameState";
import { StatBlock } from "../statBlock";

let room = "";
const rand = Math.random;


export class StartMatch extends Scene {
  constructor() {
    super("StartMatch");
    // Initialize remaining resummons
    this.remainingresummons = 3;

  }
  preload() {
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );

    // use io('https...') to commit for deploy, and io() for testing
    this.socket = io('https://geist-io.onrender.com/');
    // this.socket = io();

    this.load.image('head1', 'assets/head1.png');
    this.load.image('head2', 'assets/head2.png');
    this.load.image('head3', 'assets/head3.png');
    this.load.image('head4', 'assets/head4.png');
    this.load.image('head5', 'assets/head5.png');
    this.load.image("copy", "/assets/geist-copy.png");
    this.load.image("resummon", "/assets/geist-resummon.png");

    //this.load.image("recruit", "/assets/geist-recruit.png");

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

  this.choosingPos = {x: 640, y: 300} // position of StatBlock of an offered spirit
  this.offeredSpirit = null
  this.offeredStatblock = null
  this.bodies = []
  this.statBlocks = [];
  this.team = [];
  this.plrIndex = -1;

  this.buttonFormat = function(btn) {
    return btn
    .on("pointerover", () => {
      btn.setScale(1.05).setTint(0xca7dff);
    }) .on("pointerout", () => {
      btn.setScale(1).clearTint();
    }) .setInteractive({ useHandCursor: true })
  }
    
  this.updateDisplay = function(shownSpirit) {
    if (this.offeredSpirit) this.offeredSpirit.hide()
    this.offeredSpirit = new CharBody (this, {x: 400, y: 580}, shownSpirit.attributes)
    this.bodies.push(this.offeredSpirit)

    if (this.offeredStatblock) this.offeredStatblock.hide()
    this.offeredStatblock = new StatBlock(this, this.choosingPos, shownSpirit)
  }

    const add = this.add;

    this.bg = this.add
      .tileSprite(0, 0, 1280, 720, "background")
      .setOrigin(0)
      .setScrollFactor(0, 1);

    //start match button
    this.socket.on('yourRoomIs', (roomCode) => {
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

    this.plrIndex = -1

    this.socket.on('offerSpirit', (spirit, mode, index) => {
      if (mode === 'start') {
        this.plrIndex = index
        console.log(spirit)

        if(this.text1) this.text1.setVisible(false)

        //display offering
        this.placeholder.hide()
        this.offeredSpirit = new CharBody (this, {x: 400, y: 500}, spirit.attributes)
        bodies.push(this.offeredSpirit)

        this.statBlocks.push(new StatBlock(this, this.choosingPos, spirit))

       // Add Recruit text button
        const recruitText = this.add
        .text(600, 500, "Recruit", {
        fontFamily: '"IM Fell English", serif',
        fontSize: 24,
        color: "#ffffff",
        fontStyle: "bold",
      })
        .setInteractive({ useHandCursor: true });

      recruitText
      .on("pointerdown", () => {
      this.socket.emit('recruitSpirit');
      recruitText.setStyle({ color: "#ca7dff" });
    })
      .on("pointerover", () => {
      recruitText.setStyle({ color: "#ca7dff" });   
    })
      .on("pointerout", () => {
      recruitText.setStyle({ color: "#ffffff" });
    });

    //function for Recruit text button

        // Add Resummon button
        const resummonButton = this.add
        .image(200, 500, "resummon")
        .setInteractive({ useHandCursor: true })
        .setScale(0.5);

      resummonButton
        .on("pointerdown", () => {
          if (this.remainingResummons > 0) {
            this.remainingResummons--;
            this.socket.emit('rerollSpirit');
            this.updateResummonCounter();
          }
        })
        .on("pointerover", () => resummonButton.setTint(0xca7dff))
        .on("pointerout", () => resummonButton.clearTint());

        //function for Resummon button

        // Add Resummons Counter
        this.resummonCounter = this.add.text(550, 450, `Resummons Counter: ${this.remainingResummons}`, {
          fontFamily: '"IM Fell English", serif',
          fontSize: 20,
          color: "#ffffff",
        });

        //function for Resummons Counter

      } else if (mode === 'reroll') {
        console.log(spirit)
        this.updateDisplay(spirit)
        // reroll counter --
      } else if (mode === 'confirmed') {
        if (this.teams[this.plrIndex].length < 3) {
          this.updateDisplay(spirit);
      } else {
          console.log("Team is full!");
      }
      }
    })

    

    this.socket.on('confirmSpirit', (chosenSpirit) => { 
      // spirit for the team

      //initialise array 
      if(!this.team) this.team = []
      //push to array
      this.team.push(chosenSpirit)
      //calculate the position
      const xOffset = 100; 
      const yOffset = 50; 
      const statBlockX = xOffset;
      const statBlockY = 100 + this.team.length * yOffset;
      //display confirmed spirit
      const statBlock = new StatBlock(this, { x: statBlockX, y: statBlockY }, chosenSpirit);
      this.statBlocks.push(statBlock);
      console.log(`Spirit added to team:`, chosenSpirit);
    })

    this.socket.on('beginBattles', (teams, whoGoesFirst) => { // whoGoesFirst is 0 or 1, corresponding to this.plrIndex

    })

    this.socket.on('firstBattle', (firstFighters) => { // eg. array [2, 0], meaning firstTeam[2] fights secondTeam[0]
      
    })

    this.socket.on('secondThirdBattles', (secondFighters, thirdFighters) => {
      
    })
    
    this.btnCreateRoom = this.add.image(412, 250, "create-match");
    this.buttonFormat(this.btnCreateRoom)
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
      });

    const logo = this.add
      .image(412, 80, "logo")
    this.buttonFormat(logo)
    .on("pointerdown", () => {
        this.scene.start("Preloader");
      })

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

    this.placeholder = new CharBody(
      this,
      { x: 700, y: 580 },
      {
        height: 150 + rand() * 120, // HP, SPD
        bodyWidth: 30 + rand() * 30, // HP, DEF
        neckBaseRatio: 0.28 + rand() * 0.37, // DEF
        leanForward: rand() ** 2 * 20, // ATK
        neckType: 1, // DEF

        armLengthRatio: 0.5 + rand() * 0.2, // SPD
        armWidthRatio: 0.35 + rand() * 0.3, // ATK, DEF

        animSpeed: 0.8 + rand() * 0.4,
        
        headType: 1,
      }
    );

    //this.placeholder.hide();
  }

  updateResummonCounter() {
    if (this.resummonCounter) {
      this.resummonCounter.setText(`Resummons: ${this.remainingResummons}`);
    }
  }

  update() {
    this.bg.tilePositionY += 0.5;
    this.placeholder.frameAdvance();
    for (let i in this.bodies) {
      this.bodies[i].frameAdvance()
    }
  }
}
