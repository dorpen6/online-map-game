export class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }
  
    preload(): void {
      this.load.image('tree', './assets/tree.jpg');
      this.load.on('complete', () => {
        console.log("All files loaded successfully");
      })
    }
  
    create(): void {
      // Initialize the game state here
      this.add.text(20, 20, "Booting Game...");
      this.scene.start('MenuScene'); // Start the next scene
    }
  }
  