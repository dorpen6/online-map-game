export class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }
  
    preload() {
      // Load assets here
    }
  
    create() {
      // Initialize the game state here
      this.add.text(20, 20, "Booting Game...");
      this.scene.start('MenuScene'); // Start the next scene
    }
  }
  