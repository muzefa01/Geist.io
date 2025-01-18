import { io } from "socket.io-client";
import { test } from './test.js';
import { Joint, SpineBox } from './drawUtils.js';
import { CharBody } from './charBody.js';
const rand = Math.random

class Game extends Phaser.Scene {
    constructor() {
      super('Game');
      this.player = null;
      this.platforms = null;
      this.cursors = null;
      this.stars = null;
      this.bombs = null;
      this.score = 0;
      this.gameOver = false;
      this.scoreText = null;
      this.socket = null; // Declare the socket variable
      this.otherSprites = []; // Store other player sprites
      this.others = []; // Store other player data
    }
  
    preload() {
      this.load.image('sky', 'assets/sky.png');
      this.load.image('ground', 'assets/platform.png');
      this.load.image('star', 'assets/star.png');
      this.load.image('bomb', 'assets/bomb.png');
      this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
      
      this.load.image('head1', 'assets/head1.png');
    }
  
    create() {
      this.add.image(400, 300, 'sky');
      this.platforms = this.physics.add.staticGroup();
      this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
      this.platforms.create(600, 400, 'ground');
      this.platforms.create(50, 250, 'ground');
      this.platforms.create(750, 220, 'ground');
  
      this.player = this.physics.add.sprite(100, 450, 'dude');
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
  
      this.testChar = new CharBody(this, {x:100 + 150, y:580}, {
        height: 150 + rand()*120, // HP, SPD
        bodyWidth: 30 + rand()*30, // HP, DEF
        neckBaseRatio: 0.28 + rand()*0.37, // DEF
        leanForward: rand()**2*20, // ATK
        neckType: 1, // DEF
        
        armLengthRatio: 0.5+rand()*0.2, // SPD
        armWidthRatio: 0.3 + rand()*0.4, // ATK, DEF
        weaponGrip: 1, // ATK, SPD

        animSpeed: 0.8 + rand()*0.4,

        weaponType: 1,
        headType: 1
    })
    setInterval(() => this.testChar.frameAdvance(), 16)
    this.testChar.scale.x = -1
       

      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20,
      });
  
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.cursors = this.input.keyboard.createCursorKeys();
  
      this.stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
      });
  
      this.stars.children.iterate((child) => {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });
  
      this.bombs = this.physics.add.group();
      this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
  
      this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.stars, this.platforms);
      this.physics.add.collider(this.bombs, this.platforms);
      this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
      this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
  
      // Setup Socket.IO
      this.socket = io(); 
    }
  
    update() {
      if (this.gameOver) return;
  
     
      if (this.cursors.left.isDown) {
        //this.player.setVelocityX(-160);
        this.testChar.basePos.x += -2
        this.player.anims.play('left', true);
        this.player.animState = 'left'
      } else if (this.cursors.right.isDown) {
        //this.player.setVelocityX(160);
        this.testChar.basePos.x += 2
        this.player.anims.play('right', true);
        this.player.animState = 'right'
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
        this.player.animState = 'turn'
      }
  
      if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
        this.testChar.scale.x *= -1
      }
  
      // Emit player position to the server
      this.socket.emit('updatePlayers', {
        id: this.socket.id,
        posx: this.player.x,
        posy: this.player.y,
        animState: this.player.animState,
        collect: 0
      });
  
   
      if (!this.listenerAdded) {
        this.listenerAdded = true;
        
        const socketUpdate = (data) => {
          // Clear existing sprites for other players
          for (let sprite of this.otherSprites) {
            sprite.destroy(true);
          }
          this.otherSprites = [];
  
          // Update other player data and create new sprites
          this.others = data;
  
          if (this.others !== null) {
            for (let i = 0; i < this.others.length; i++) {
              if (this.others[i].id !== this.socket.id) {
                const newPlayer = this.physics.add.sprite(
                  this.others[i].posx,
                  this.others[i].posy,
                  'dude'
                );
                this.otherSprites.push(newPlayer);
              }}}}
        this.socket.on('updatePlayers', socketUpdate);
      
      }
    }
  
    collectStar(player, star) {
      star.disableBody(true, true);
      this.score += 10;
      this.scoreText.setText('Score: ' + this.score);
  
      if (this.stars.countActive(true) === 0) {
        this.stars.children.iterate((child) => {
          child.enableBody(true, child.x, 0, true, true);
        });
  
        const x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        const bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
      }
    }
  
    hitBomb(player, bomb) {
      this.physics.pause();
      this.player.setTint(0xff0000);
      this.player.anims.play('turn');
      this.gameOver = true;
    }
  }
  
  window.Game = Game;
//

  // const config = {
  //   type: Phaser.AUTO,
  //   width: 800,
  //   height: 600,
  //   scene: Game,
  //   physics: {
  //     default: 'arcade',
  //     arcade: {
  //       gravity: { y: 300 },
  //       debug: false,
  //     },
  //   },
  // };

  // const game = new Phaser.Game(config);
  export { Game };