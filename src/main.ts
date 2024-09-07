import Phaser from "phaser";
import { BootScene } from './scenes/BootScene'
import { MenuScene } from "./scenes/GameScene";
import { Constants } from "./constants";

const config = {
  type: Phaser.AUTO,
  width: Constants.gameWindowWidth,
  height: Constants.gameWindowHeight,
  scene: [BootScene, MenuScene]
}

new Phaser.Game(config);