import Phaser from 'phaser';

export default class MyGame extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private bullets!: Phaser.Physics.Arcade.Group;
    private isShooting: boolean = false;
    private zoomScale: number = 1; // Initial zoom scale
    private grid!: Phaser.GameObjects.TileSprite;
    private cursors?: {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
    }; // WASD keys for movement

    constructor() {
        super({ key: 'MyGame' });
    }

    preload(): void {
        this.load.image('player', 'assets/player.png');
        this.load.image('bullet', 'assets/bullet.png');
    }

    create(): void {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
            console.error('Failed to get canvas context.');
            return;
        }
    
        const gridSize = 64; // Increased grid size
        const gridColor = '#b0b0b0'; // Softer grid color
        const width = this.cameras.main.width * 2; // Increased map width
        const height = this.cameras.main.height * 2; // Increased map height
    
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
    
        context.stroke();
    
        const textureKey = 'grid';
        this.textures.addCanvas(textureKey, canvas);
    
        this.grid = this.add.tileSprite(0, 0, width, height, textureKey)
            .setOrigin(0, 0);
    
        this.cameras.main.backgroundColor.setTo(200, 200, 210);
    
        // Set camera bounds and size
        this.cameras.main.setBounds(0, 0, width, height);
        this.cameras.main.setZoom(this.zoomScale);
        
        // Add player and bullets
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
    
        // Set player bounds based on camera bounds
        this.physics.world.setBounds(0, 0, width, height);
    
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });
    
        // Add player to the camera
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
    
        // Draw deadline corner line
        this.add.rectangle(width - 5, height - 5, 10, 10, 0xff0000, 1)
            .setOrigin(1, 1);
    
        // Set up input events
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
    
        // Initialize WASD keys, checking for input keyboard existence
        if (this.input.keyboard) {
            this.cursors = {
                up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            };
        }
    
        // Disable the right-click context menu
        this.sys.game.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault(); // Prevent the default context menu
        });
    }
            
    update(): void {
        if (this.isShooting) {
            const pointer = this.input.activePointer;
            this.shootBullet(pointer);
        }

        if (this.cursors) {
            const speed = 200; // Movement speed

            // Move player with WASD keys
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-speed);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(speed);
            } else {
                this.player.setVelocityX(0);
            }

            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-speed);
            } else if (this.cursors.down.isDown) {
                this.player.setVelocityY(speed);
            } else {
                this.player.setVelocityY(0);
            }
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
