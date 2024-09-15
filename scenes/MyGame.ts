// src/MyGame.ts
import Phaser from 'phaser';
import Player from './Player';
import Bullets from './Bullets';
import Grid from './Grid';

export default class MyGame extends Phaser.Scene {
    private player!: Player;
    private bullets!: Bullets;
    private grid!: Grid;
    private isShooting: boolean = false;
    private zoomScale: number = 1;
    private cursors?: {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
    };

    constructor() {
        super({ key: 'MyGame' });
    }

    preload(): void {
        this.load.image('player', 'assets/player.png');
        this.load.image('bullet', 'assets/bullet.png');
    }

    create(): void {
        this.grid = new Grid(this);
        this.player = new Player(this);
        this.bullets = new Bullets(this);

        this.cameras.main.backgroundColor.setTo(200, 200, 210);
        this.cameras.main.setBounds(0, 0, this.grid.tileSprite.width, this.grid.tileSprite.height);
        this.cameras.main.setZoom(this.zoomScale);

        this.player.setBounds(this.grid.tileSprite.width, this.grid.tileSprite.height);

        this.cameras.main.startFollow(this.player.sprite, true, 0.5, 0.5);
        this.add.rectangle(this.grid.tileSprite.width - 5, this.grid.tileSprite.height - 5, 10, 10, 0xff0000, 1).setOrigin(1, 1);

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.isShooting = true;
                this.bullets.shoot(this.player.sprite.x, this.player.sprite.y, pointer.x, pointer.y);
            }
        });

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.isShooting = false;
            }
        });

        this.input.on('wheel', this.handleMouseWheel, this);

        if (this.input.keyboard) {
            this.cursors = {
                up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            };
        }

        this.sys.game.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    }

    update(): void {
        if (this.isShooting) {
            const pointer = this.input.activePointer;
            this.bullets.shoot(this.player.sprite.x, this.player.sprite.y, pointer.x, pointer.y);
        }

        if (this.cursors) {
            const speed = 200;

            if (this.cursors.left.isDown) {
                this.player.sprite.setVelocityX(-speed);
            } else if (this.cursors.right.isDown) {
                this.player.sprite.setVelocityX(speed);
            } else {
                this.player.sprite.setVelocityX(0);
            }

            if (this.cursors.up.isDown) {
                this.player.sprite.setVelocityY(-speed);
            } else if (this.cursors.down.isDown) {
                this.player.sprite.setVelocityY(speed);
            } else {
                this.player.sprite.setVelocityY(0);
            }
        }
    }

    private handleMouseWheel(event: WheelEvent): void {
        const zoomSpeed = 0.1;
        const delta = event.deltaY > 0 ? -zoomSpeed : zoomSpeed;

        this.zoomScale = Phaser.Math.Clamp(this.zoomScale + delta, 0.5, 2);
        this.cameras.main.setZoom(this.zoomScale);
    }
}
