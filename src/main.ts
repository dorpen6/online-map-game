import Phaser from "phaser";
import { BootScene } from './scenes/BootScene'
import { GameScene } from "./scenes/GameScene";
import { Constants } from "./constants";

const config = {
  type: Phaser.AUTO,
  width: Constants.gameWindowWidth,
  height: Constants.gameWindowHeight,
  scene: [BootScene, GameScene]
}

new Phaser.Game(config);