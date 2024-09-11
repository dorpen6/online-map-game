import Phaser from 'phaser';
import io from 'socket.io-client';

class MyGame extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private bullets!: Phaser.Physics.Arcade.Group;
    private socket!: SocketIOClient.Socket;
    private zoomSpeed: number = 0.1;
    private minZoom: number = 0.5;
    private maxZoom: number = 2.0;
    private destination?: Phaser.Math.Vector2;
    private isShooting: boolean = false;
    private audioContext: AudioContext | null = null;
    private moveSpeed: number = 240; // Speed of player movement
    private bulletSpeed: number = 400; // Speed of bullet movement

    constructor() {
        super({ key: 'MyGame' });
    }

    preload(): void {
        this.load.image('player', 'assets/player.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('background', 'assets/background.png');
    }

    create(): void {
        this.socket = io();

        const background = this.add.image(0, 0, 'background');
        background.setOrigin(0, 0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.player = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'player');
        this.player.setCollideWorldBounds(true);

        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.fireBullet(pointer);
            } else {
                this.destination = new Phaser.Math.Vector2(pointer.x, pointer.y);
                this.movePlayerToDestination();
            }

            // Resume AudioContext on user gesture
            this.resumeAudioContext();
        });

        if (this.input.mouse) {
            this.input.mouse.disableContextMenu();
        }

        this.input.on('wheel', (event: Phaser.Input.Pointer) => {
            const zoomDelta = event.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
            const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom + zoomDelta, this.minZoom, this.maxZoom);
            this.cameras.main.setZoom(newZoom);
        });

        this.cameras.main.startFollow(this.player);

        this.socket.on('playerMovement', (data: { x: number, y: number }) => {
            console.log('Received player movement:', data);
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.player) {
                this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y });
            }
        });

        // Initialize AudioContext
        this.initAudioContext();
    }

    initAudioContext(): void {
        // Do not create AudioContext here to avoid creating it before user interaction
    }

    resumeAudioContext(): void {
        if (!this.audioContext) {
            // Create an AudioContext if not already created
            this.audioContext = new (window as any).AudioContext();
        }

        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('AudioContext resumed');
            }).catch((error) => {
                console.error('Error resuming AudioContext:', error);
            });
        }
    }

    fireBullet(pointer: Phaser.Input.Pointer): void {
        const bullet = this.bullets.get(this.player.x, this.player.y) as Phaser.Physics.Arcade.Sprite;
    
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setVelocity(0); // Reset bullet velocity
    
            // Ensure bullet.body is not null
            const bulletBody = bullet.body as Phaser.Physics.Arcade.Body | null;
            if (bulletBody) {
                // Calculate the bullet's scale
                const playerScale = this.player.displayWidth / this.player.width;
                bullet.setScale(playerScale / 4);
    
                // Calculate the angle between the player and the click position
                const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
    
                // Set bullet direction and speed
                bullet.setAngle(Phaser.Math.RadToDeg(angle));
                this.physics.velocityFromRotation(angle, this.bulletSpeed, bulletBody.velocity);
            }
        }
    }
    
    movePlayerToDestination(): void {
        if (this.destination) {
            // Stop any previous movement
            this.player.setVelocity(0);
            // Move player to the destination
            this.physics.moveTo(this.player, this.destination.x, this.destination.y, this.moveSpeed);
        }
    }

    update(): void {
        if (this.destination) {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                this.destination.x, this.destination.y
            );

            // Stop player when close to the destination
            if (distance < 4) {
                this.player.setVelocity(0);
                this.destination = undefined;
            }
        }

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

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: MyGame,
    autoCenter: Phaser.Scale.CENTER_BOTH
};

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

const game = new Phaser.Game(config);
