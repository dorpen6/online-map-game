// src/Grid.ts
import Phaser from 'phaser';

export default class Grid {
    private scene: Phaser.Scene;
    private gridSize: number = 64;
    private gridColor: string = '#b0b0b0';
    public tileSprite!: Phaser.GameObjects.TileSprite;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.create();
    }

    private create() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
            console.error('Failed to get canvas context.');
            return;
        }

        const width = this.scene.cameras.main.width * 2;
        const height = this.scene.cameras.main.height * 2;

        canvas.width = width;
        canvas.height = height;

        context.strokeStyle = this.gridColor;
        context.lineWidth = 1;

        // Draw vertical and horizontal lines
        for (let x = 0; x <= width; x += this.gridSize) {
            context.moveTo(x, 0);
            context.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += this.gridSize) {
            context.moveTo(0, y);
            context.lineTo(width, y);
        }

        context.stroke();

        const textureKey = 'grid';
        this.scene.textures.addCanvas(textureKey, canvas);

        this.tileSprite = this.scene.add.tileSprite(0, 0, width, height, textureKey).setOrigin(0, 0);
    }
}
