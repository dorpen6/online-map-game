import Phaser from 'phaser';

export default class MyGame extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private bullets!: Phaser.Physics.Arcade.Group;
    private isShooting: boolean = false;
    private zoomScale: number = 1; // Initial zoom scale
    private grid!: Phaser.GameObjects.TileSprite;

    constructor() {
        super({ key: 'MyGame' });
    }

    preload(): void {
        this.load.image('player', 'assets/player.png');
        this.load.image('bullet', 'assets/bullet.png');
    }

    create(): void {
        // Create a canvas element to draw the grid
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
            console.error('Failed to get canvas context.');
            return;
        }
    
        const gridSize = 32; // Size of each grid square
        const gridColor = '#b0b0b0'; // Softer color for the grid lines
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
    
        canvas.width = width;
        canvas.height = height;
    
        context.strokeStyle = gridColor;
        context.lineWidth = 1;
    
        // Draw vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            context.moveTo(x, 0);
            context.lineTo(x, height);
        }
    
        // Draw horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            context.moveTo(0, y);
            context.lineTo(width, y);
        }
    
        context.stroke(); // Actually draw the lines on the canvas
    
        // Generate a texture from the canvas
        const textureKey = 'grid';
        this.textures.addCanvas(textureKey, canvas);
    
        // Create a TileSprite with the grid texture
        this.grid = this.add.tileSprite(0, 0, width, height, textureKey)
            .setOrigin(0, 0);
    
        // Set background color
        this.cameras.main.backgroundColor.setTo(200, 200, 210); // Soft blue-gray background color
    
        // Add player and bullets
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
    
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });
    
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.isShooting = true;
                this.shootBullet(pointer);
            }
        });
    
        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.isShooting = false;
            }
        });
    
        this.input.on('wheel', this.handleMouseWheel, this);
    
        // Make the camera follow the player
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5); // Adjust smoothing parameters
    
        // Set camera bounds to prevent jitter
        this.cameras.main.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);
    }
    
    update(): void {
        if (this.isShooting) {
            const pointer = this.input.activePointer;
            this.shootBullet(pointer);
        }

        if (this.input.activePointer.isDown) {
            this.physics.moveTo(this.player, this.input.x, this.input.y, 240);
        } else {
            this.player.setVelocity(0);
        }
    }

    private shootBullet(pointer: Phaser.Input.Pointer): void {
        const bullet = this.bullets.getFirstDead(false) as Phaser.Physics.Arcade.Sprite;

        if (!bullet) {
            return;
        }

        bullet.setPosition(this.player.x, this.player.y);
        bullet.setActive(true);
        bullet.setVisible(true);
        this.physics.moveTo(bullet, pointer.x, pointer.y, 600);

        bullet.on('worldbounds', () => {
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.setPosition(-100, -100); // Move bullet offscreen
        });
    }

    private handleMouseWheel(event: WheelEvent): void {
        const zoomSpeed = 0.1;
        const delta = event.deltaY > 0 ? -zoomSpeed : zoomSpeed;

        this.zoomScale = Phaser.Math.Clamp(this.zoomScale + delta, 0.5, 2);
        this.cameras.main.setZoom(this.zoomScale);
    }
}
