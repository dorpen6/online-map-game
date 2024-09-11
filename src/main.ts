import Phaser from 'phaser';
import BootScene from '/home/aliva/apple-catcher/scenes/BootScene'
import MyGame from '/home/aliva/apple-catcher/scenes/MyGame'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MyGame], // Register the scenes
    autoCenter: Phaser.Scale.CENTER_BOTH
};

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

const game = new Phaser.Game(config);
