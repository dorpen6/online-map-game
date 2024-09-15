// src/Player.ts
import Phaser from 'phaser';

export default class Player {
    private scene: Phaser.Scene;
    public sprite!: Phaser.Physics.Arcade.Sprite;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.create();
    }

    private create() {
        this.sprite = this.scene.physics.add.sprite(400, 300, 'player');
        this.sprite.setCollideWorldBounds(true);
    }

    public setBounds(width: number, height: number) {
        this.scene.physics.world.setBounds(0, 0, width, height);
    }
}
