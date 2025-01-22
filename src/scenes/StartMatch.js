import { Scene } from "phaser";
import { CharBody } from "../charBody";
import { io } from "socket.io-client";
import { GameState } from "../gameState";
import { StatBlock } from "../statBlock";
import { BattleAnims } from "../battleAnims";

let room = "";
const rand = Math.random;
function opp(i) {return ["1", "0"][i]}
function curry(callback, arg) {
  return () => {
    return callback(arg)
  }
}

export class StartMatch extends Scene {
  constructor() {
    super("StartMatch");
    // Initialize remaining resummons
    this.remainingResummons = 3;

  }
  preload() {
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );

    // use io('https...') to commit for deploy, and io() for testing
    // this.socket = io('https://geist-io.onrender.com/');
    this.socket = io();

    this.load.image('head1', 'assets/head1.png');
    this.load.image('head2', 'assets/head2.png');
    this.load.image('head3', 'assets/head3.png');
    this.load.image('head4', 'assets/head4.png');
    this.load.image('head5', 'assets/head5.png');
    this.load.image("copy", "/assets/geist-copy.png");
    this.load.image("resummon", "/assets/geist-resummon.png");
    this.load.image("recruit", "/assets/geist-recruit.png");
    this.load.image("select", "/assets/geist-select-grey.png")

    this.load.image("stats", "/assets/geist-stats.png");
    for (let i = 1; i <= 5; i++) {
      this.load.image(`head${i}`, `assets/head${i}.png`); }
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

  this.choosingPos = {x: 540, y: 300} // position of StatBlock of an offered spirit
  this.offeredSpirit = null
  this.offeredStatblock = null
  this.bodies = []
  this.statBlocks = [];
  this.team = []; // for recruitment phase
  this.teams = null // for battle phase
  this.plrIndex = -1;
  this.topText = this.add.text(400, 120, "", {
          fontFamily: '"IM Fell English", serif',
          fontSize: 30,
          color: "#ffffff",
          fontStyle: "bold",
        }).setVisible(false).setOrigin(0.5, 0.5).setDepth(1)
  this.showTT = function(text) {return this.topText.setVisible(true).setText(text)}
  this.hideTT = function() {return this.topText.setVisible(false)}

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

    if (this.offeredStatblock) this.offeredStatblock.destroy()
    this.offeredStatblock = new StatBlock(this, this.choosingPos, shownSpirit, false)
  }

    const add = this.add;

    this.bg = this.add
      .tileSprite(0, 0, 1280, 720, "background")
      .setOrigin(0)
      .setScrollFactor(0, 1);

    //start match button
    this.socket.on('yourRoomIs', (roomCode) => {
      room = roomCode;
      this.text1 = this.add
        .text(255, 160, `your match code is ${room}`, {
          //fontFamily: '"IM Fell English", serif',
          fontSize: 20,
          color: "#ffffff",
          fontStyle: "bold",
        })
        .setVisible(true);
    });

    this.plrIndex = -1

    this.socket.on('offerSpirit', (spirit, mode, index) => {
      if (mode === 'start') {
        this.plrIndex = index
        this.showTT("             [Recruit] powerful spirits\n             [Resummon] to conjure a new spirit")

        if (this.text1) this.text1.setVisible(false)
        if (copyButton) copyButton.setVisible(false)
        if (this.copyText) this.copyText.setVisible(false)
        logo.setVisible(false)
        if (this.btnJoinRoom) this.btnJoinRoom.setVisible(false)
        if (this.txtJoinRoom) document.getElementById("codeText").remove()
        if (this.txtJoinTip) this.txtJoinTip.setVisible(false)

        //display offering
        this.placeholder.hide()
        this.offeredSpirit = new CharBody (this, {x: 400, y: 580}, spirit.attributes)
        this.bodies.push(this.offeredSpirit)

        this.offeredStatblock = (new StatBlock(this, this.choosingPos, spirit, false))

       // Add Recruit text button
        this.recruitText = this.add
        .image(200, 500, 'recruit')
        .setInteractive({ useHandCursor: true })
        .setScale(0.5)

      this.recruitText
      .on("pointerdown", () => {
        this.socket.emit('recruitSpirit', room)
      })
      .on("pointerover", () => {this.recruitText.setTint(0xca7dff)})
      .on("pointerout", () => {this.recruitText.clearTint()});

    //function for Recruit text button

        // Add Resummon button
        this.resummonButton = this.add
        .image(600, 500, "resummon")
        .setInteractive({ useHandCursor: true })
        .setScale(0.5);

        this.resummonButton
        .on("pointerdown", () => {
          this.socket.emit('rerollSpirit', room);
        })
        .on("pointerover", () => this.resummonButton.setTint(0xca7dff))
        .on("pointerout", () => this.resummonButton.clearTint());

        //function for Resummon button

        // Add Resummons Counter
        this.resummonCounter = this.add.text(540, 445, `Resummons: ${this.remainingResummons}`, {
          fontFamily: '"IM Fell English", serif',
          fontSize: 20,
          color: "#ffffff",
        });

        //function for Resummons Counter

      } else if (mode === 'reroll') {
        this.updateDisplay(spirit)
        this.remainingResummons--;
        this.updateResummonCounter();
        // reroll counter --
      } else if (mode === 'confirmed') {
        if (this.team.length < 3) {
          this.updateDisplay(spirit);
      } else {
      }
      }
    })

    

    this.socket.on('confirmSpirit', (chosenSpirit, currentLength) => { 
      // spirit for the team

      //push to array
      this.team.push(chosenSpirit)
      //calculate the position
      const xOffset = 120; 
      const yOffset = 180; 
      const statBlockX = xOffset;
      const statBlockY = 100 + (this.team.length-1) * yOffset;
      //display confirmed spirit
      const statBlock = new StatBlock(this, { x: statBlockX, y: statBlockY }, chosenSpirit);
      this.statBlocks.push(statBlock);
      if (currentLength >= 3) {
        this.recruitText.setVisible(false)
        this.resummonButton.setVisible(false)
        this.resummonCounter.setVisible(false)
        this.offeredStatblock.destroy()
      }
    })

    this.selectorsE = []
    this.selectorsP = []
    //this.selectorsAll = this.plrIndex === 0 ? [this.selectorsP, this.selectorsE] : [this.selectorsE, this.selectorsP]
    this.teamsReady = [[true, true, true], [true, true, true]]

    this.switchAlly = function(ind) {
      for (let i in this.selectorsP) {
        if (i*1 === ind*1) this.teamsDisplay[this.plrIndex][i].show()
        else this.teamsDisplay[this.plrIndex][i].hide()
      }
    }

    this.showTeams = function(hiding, choosing) {
      for (let i in [0, 0, 0]) { // whatever lol
        this.selectorsP[i].setVisible(false)
        this.selectorsE[i].setVisible(false)

        if (this.teamsReady[this.plrIndex][i] && !hiding) {
          this.statBlocks[i].show()
          if (choosing) this.selectorsP[i].setVisible(true)
        }
        else this.statBlocks[i].hide()

        if (this.teamsReady[opp(this.plrIndex)][i] && !hiding) {
          this.teamsDisplay[opp(this.plrIndex)][i].show()
          if (choosing) this.selectorsE[i].setVisible(true)
        }
        else this.teamsDisplay[opp(this.plrIndex)][i].hide()
      }
    }

    this.socket.on('beginBattles', (teams, whoGoesFirst) => { // whoGoesFirst is 0 or 1, corresponding to this.plrIndex
      this.teams = teams
      this.whoGoesFirst = whoGoesFirst
      this.mask = [[true, true, true], [true, true, true]]

      this.offeredSpirit.hide()
      this.teamsDisplay = [[], []]
      this.currentAlly = 0
      this.chosen = [null, null]

      for (let i in teams[opp(this.plrIndex)]) {
        const newEnemy = new CharBody(this, {x: 500 + i*120, y: 550}, teams[opp(this.plrIndex)][i].attributes)
        this.bodies.push(newEnemy)
        this.teamsDisplay[opp(this.plrIndex)].push(newEnemy)

        const newAlly = new CharBody(this, {x: 250, y: 550}, teams[this.plrIndex][i].attributes)
        newAlly.scale.x = -1
        this.bodies.push(newAlly)
        this.teamsDisplay[this.plrIndex].push(newAlly)
        newAlly.hide()

        this.selectorsE.push(this.add.image(500 + i*120, 575, 'select').setScale(0.3).setVisible(false))
        this.selectorsE[i].setInteractive({useHandCursor: true}).on("pointerover", curry((ind) => {
          this.selectorsE[ind].setScale(0.315).setTint(0xca7dff)}, i)).on("pointerout", curry((ind) => {
          this.selectorsE[ind].setScale(0.3).clearTint()}, i)).on("pointerdown", curry((ind) => {
            // click
            this.chosen[opp(this.plrIndex)] = ind
            this.choiceCheck()
            for (let k in [0, 0, 0]) {
              this.selectorsE[k].setVisible(false)
              if (k !== ind) {
                this.teamsDisplay[opp(this.plrIndex)][k].hide()
              }
            }
          }, i))

        this.selectorsP.push(this.add.image(120, 200 + i*180, 'select').setScale(0.3).setVisible(false)) 
        this.selectorsP[i].setInteractive({useHandCursor: true}).on("pointerover", curry((ind) => {
          this.selectorsP[ind].setScale(0.315).setTint(0xca7dff)
          this.switchAlly(ind)}, i)).on("pointerout", curry((ind) => {
          this.selectorsP[ind].setScale(0.3).clearTint()}, i)).on("pointerdown", curry((ind) => {
            // click
            this.chosen[this.plrIndex] = ind
            this.choiceCheck()
            for (let k in [0, 0, 0]) {
              this.selectorsP[k].setVisible(false)
              if (k !== ind) {
                this.statBlocks[k].hide()
              }
            }
          }, i))

        this.choiceCheck = function() {
          if ((this.chosen[0] !== null) && (this.chosen[1] !== null)) {
            console.log(this.chosen + " chosen, room " + room)
            this.socket.emit('chooseMatchup1', room, this.chosen)
          }

        }
      }

      if (whoGoesFirst === this.plrIndex) {
        this.showTT("Choose which spirit fights\nwhich enemy first.")
        this.showTeams(false, true)
      } else {
        this.showTT("Waiting for enemy to\nchoose first fighters...")
        this.showTeams(false, false)
      }
    })

    this.socket.on('firstBattle', (firstFighters) => { // eg. array [2, 0], meaning firstTeam[2] fights secondTeam[0]
      this.showTT("FIGHT 1")
      this.showTeams(true, false)
      this.switchAlly(-1)

      this.currentBattle = new BattleAnims(this, 
        [this.teams[this.plrIndex][firstFighters[this.plrIndex]], 
        this.teams[opp(this.plrIndex)][firstFighters[opp(this.plrIndex)]]], 
        (data) => {
      } )
    })

    this.socket.on('secondThirdBattles', (secondFighters, thirdFighters) => {
      
    })
    
    this.btnCreateRoom = this.add.image(412, 250, "create-match");
    this.buttonFormat(this.btnCreateRoom)
      .on("pointerdown", () => {
        this.socket.emit("createRoom");
        this.btnCreateRoom.setVisible(false);
        this.joinMatchBtn.setVisible(false);
        this.copyText = this.add
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
      .image(545, 170, "copy")
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
        this.txtJoinTip = this.add
          .text(265, 160, `to join a match, enter code below`, {
            fontFamily: '"IM Fell English", serif',
            fontSize: 20,
            color: "#ffffff",
            fontStyle: "normal",
          })
          .setVisible(true);
        this.placeholder.show();
        this.txtJoinRoom = this.add.dom(375, 210).createFromHTML(`
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
            room = document.getElementById("codeText").value
            this.btnJoinRoom.setStyle({ fill: "#FF00FF" });
      })
      .on("pointerup", () => {
            this.btnJoinRoom.setStyle({ fill: "#FFFFFF" });
          });
      });

    

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
    if (this.currentBattle) this.currentBattle.update()
  }
}
