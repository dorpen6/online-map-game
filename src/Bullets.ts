// src/Bullets.ts
import Phaser from 'phaser';

export default class Bullets {
    private scene: Phaser.Scene;
    public group!: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.create();
    }

    private create() {
        this.group = this.scene.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });
    }

    public shoot(x: number, y: number, targetX: number, targetY: number) {
        const bullet = this.group.getFirstDead(false) as Phaser.Physics.Arcade.Sprite;
        if (!bullet) return;

        bullet.setPosition(x, y);
        bullet.setActive(true);
        bullet.setVisible(true);
        this.scene.physics.moveTo(bullet, targetX, targetY, 600);

        bullet.on('worldbounds', () => {
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.setPosition(-100, -100); // Move bullet offscreen
        });
    }
}
