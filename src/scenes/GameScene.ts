import { Constants } from "../constants";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' }) 
    }

    create() {
        const image = this.add.image(0, 0, 'tree').setOrigin(0, 0);
        image.setDisplaySize(Constants.gameWindowWidth, Constants.gameWindowHeight);
        this.add.text(20, 20, "All files loaded successfully");

    }
}