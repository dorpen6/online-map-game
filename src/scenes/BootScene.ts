export class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }
  
    preload() {
      // Load assets here
    }
  
    create() {
      // Initialize the game state here
      this.scene.start('GameScene'); // Start the next scene
    }
  }
  