import Phaser from 'phaser';

export default class MyGame extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private bullets!: Phaser.Physics.Arcade.Group;
    private isShooting: boolean = false;

    constructor() {
        super({ key: 'MyGame' });
    }

    preload(): void {
        this.load.image('player', 'assets/player.png');
        this.load.image('bullet', 'assets/bullet.png');
    }

    create(): void {
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
}
