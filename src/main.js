import { Game } from "./Game.js"; // Import Game class
import Phaser from 'phaser';

window.addEventListener("DOMContentLoaded", () => {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Game],
    parent: "game-container",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: false,
      },
    },
  };


  const game = new Phaser.Game(config);
});
