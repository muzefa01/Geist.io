import { io } from "socket.io-client";
import { CharBody } from '../charBody.js';
const rand = Math.random
class Game extends Phaser.Scene {
    constructor() {
      super('Game');
    }
  
    preload() {
      
      this.load.image('head1', 'assets/head1.png');
    }
  
    create() {
  
      this.testChar = new CharBody(this, {x:100 + 150, y:580}, {
        height: 150 + rand()*120, // HP, SPD
        bodyWidth: 30 + rand()*30, // HP, DEF
        neckBaseRatio: 0.28 + rand()*0.37, // DEF
        leanForward: rand()**2*20, // ATK
        neckType: 1, // DEF
        
        armLengthRatio: 0.5+rand()*0.2, // SPD
        armWidthRatio: 0.35 + rand()*0.3, // ATK, DEF
        weaponGrip: 1, // ATK, SPD

        animSpeed: 0.8 + rand()*0.4,

        weaponType: 1,
        headType: 1
    })


    setInterval(() => this.testChar.frameAdvance(), 16)
    this.testChar.scale.x = -1

    this.btnCreateRoom = this.add.text(100, 100, 'createRoom', {fill: '#FFFFFF'})
    this.btnCreateRoom.setInteractive()
    this.btnCreateRoom.on('pointerdown', () => {
      this.socket.emit('createRoom')
      this.btnCreateRoom.setStyle({fill: '#FF00FF'})
    }).on('pointerup', () => {this.btnCreateRoom.setStyle({fill: '#FFFFFF'})})

    this.txtJoinRoon = this.add.dom(300, 130).createFromHTML(`
      <input type="text" id="codeText" name="codeText" placeholder="Room Code" style="font-size: 15px">
      `)
    
    this.btnJoinRoom = this.add.text(100, 130, 'joinRoom', {fill: '#FFFFFF'})
    this.btnJoinRoom.setInteractive()
    this.btnJoinRoom.on('pointerdown', () => {
      this.socket.emit('joinRoom', document.getElementById('codeText').value)
      this.btnJoinRoom.setStyle({fill: '#FF00FF'})
    }).on('pointerup', () => {this.btnJoinRoom.setStyle({fill: '#FFFFFF'})})

    this.cursors = this.input.keyboard.createCursorKeys();

      // Setup Socket.IO
    this.socket = io('https://geist-io.onrender.com/'); 
    }
  
    update() {
   
    }
  
  }
  
  window.Game = Game;

  export { Game };