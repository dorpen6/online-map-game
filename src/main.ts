import Phaser from 'phaser';
import BootScene from './BootScene';
import MyGame from './MyGame';

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
    scene: [BootScene, MyGame], // Only include the BootScene and MyGame
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        // No 'active' property here
    }
};

const game = new Phaser.Game(config);

// Resize the game canvas when the window is resized
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
