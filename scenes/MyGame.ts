import Phaser from 'phaser';

export default class MyGame extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private bullets!: Phaser.Physics.Arcade.Group;
    private destination?: Phaser.Math.Vector2;
    private moveSpeed: number = 240; // Speed of player movement
    private bulletSpeed: number = 400; // Speed of bullet movement

    constructor() {
        super({ key: 'MyGame' });
    }

    create(): void {
        // Add background image
        const background = this.add.image(0, 0, 'background');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Add the player sprite
        this.player = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'player');
        this.player.setCollideWorldBounds(true);

        // Bullets group
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });

        // Mouse input for movement and shooting
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.fireBullet(pointer);
            } else {
                this.destination = new Phaser.Math.Vector2(pointer.x, pointer.y);
                this.movePlayerToDestination();
            }
        });

        // Zoom and camera follow player
        this.cameras.main.startFollow(this.player);
    }

    fireBullet(pointer: Phaser.Input.Pointer): void {
        const bullet = this.bullets.get(this.player.x, this.player.y) as Phaser.Physics.Arcade.Sprite;
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            const bulletBody = bullet.body as Phaser.Physics.Arcade.Body | null;
            if (bulletBody) {
                const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
                this.physics.velocityFromRotation(angle, this.bulletSpeed, bulletBody.velocity);
            }
        }
    }

    movePlayerToDestination(): void {
        if (this.destination) {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                this.destination.x, this.destination.y
            );
            if (distance > 1) {
                this.player.setVelocity(0);
                this.physics.moveTo(this.player, this.destination.x, this.destination.y, this.moveSpeed);
            } else {
                this.player.setPosition(this.destination.x, this.destination.y);
                this.player.setVelocity(0);
                this.destination = undefined;
            }
        }
    }

    update(): void {
        this.bullets.children.iterate((bullet) => {
            if (bullet instanceof Phaser.Physics.Arcade.Sprite) {
                const bounds = bullet.getBounds();
                if (bounds.right < 0 || bounds.left > this.cameras.main.width ||
                    bounds.bottom < 0 || bounds.top > this.cameras.main.height) {
                    bullet.setActive(false);
                    bullet.setVisible(false);
                }
            }
            return null;
        });
    }
}
