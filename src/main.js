import { Game } from "./scenes/Game.js";
import { Boot } from "./scenes/Boot.js";
import { Preloader } from "./scenes/Preloader.js";
import { MainMenu } from "./scenes/MainMenu.js";
import Phaser from "phaser";
import { StartMatch } from "./scenes/StartMatch.js";
import { JoinMatch } from "./scenes/JoinMatch.js";
import { HowToPlay } from "./scenes/HowToPlay.js";

window.addEventListener("DOMContentLoaded", () => {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Boot, Preloader, MainMenu, StartMatch, JoinMatch, HowToPlay, Game],
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
