import Phaser from 'phaser';

export default class Bullets {
    private scene: Phaser.Scene;
    private bullets!: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.create();
    }

    private create() {
        this.bullets = this.scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            defaultKey: 'bullet',
            maxSize: 10
        });
    }

    public shoot(x: number, y: number, targetX: number, targetY: number) {
        const bullet = this.bullets.get(x, y);

        if (bullet) {
            bullet.setActive(true).setVisible(true);
            const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
            this.scene.physics.velocityFromRotation(angle, 600, bullet.body.velocity);
            bullet.rotation = angle;
        }
    }
}
