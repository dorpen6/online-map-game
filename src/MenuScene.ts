import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    private serverInput!: HTMLInputElement;
    private connectButton!: HTMLButtonElement;

    constructor() {
        super({ key: 'MenuScene' });
    }

    preload(): void {
        // Load any assets needed for the menu
    }

    create(): void {
        // Create text for instructions
        this.add.text(100, 50, 'Enter Server URL:', { fontSize: '24px', color: '#fff' });

        // Create input field and button using plain HTML
        this.createHTMLUI();

        // Set up the button click event
        this.connectButton.addEventListener('click', () => {
            const serverURL = this.serverInput.value;
            if (serverURL) {
                this.connectToServer(serverURL);
            }
        });
    }

    private createHTMLUI(): void {
        // Create an input field and button in the DOM
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '100px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.textAlign = 'center';

        this.serverInput = document.createElement('input');
        this.serverInput.type = 'text';
        this.serverInput.placeholder = 'Server URL';
        this.serverInput.style.fontSize = '24px';
        this.serverInput.style.marginBottom = '10px';

        this.connectButton = document.createElement('button');
        this.connectButton.textContent = 'Connect';
        this.connectButton.style.fontSize = '24px';

        container.appendChild(this.serverInput);
        container.appendChild(this.connectButton);
        document.body.appendChild(container);
    }

    private connectToServer(url: string): void {
        this.scene.start('MyGame', { serverURL: url });
    }
}
