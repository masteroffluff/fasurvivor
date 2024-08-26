class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    // ***** PRELOAD FUNCTION *******
    preload() {
        this.load.image('enemy1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
        this.load.image('player', 'https://content.codecademy.com/courses/learn-phaser/codey.png');
        this.load.image('fireball', './imgs/fireball.png');
        this.load.image('sword', './imgs/sword3.png');
        this.load.image('gem1', './imgs/gem1.png');
        this.load.image('heart', './imgs/heart.png');

        // Load packs
        this.load.pack('bonusesPack', './data/bonusesPack.json');
        this.load.pack('weaponsPack', './data/weaponsTemp.json');
    }

    // ***** CREATE FUNCTION *******
    create() {
        // Log the cache contents

        const sprite = this.add.sprite(400, 300, 'sword').setOrigin(0, 0.5);
        const angle = -120
        sprite.angle = angle;  // Set initial angle

        console.log('Initial angle:', sprite.angle);

        this.tweens.add({
            targets: sprite,
            angle:-360+sprite.angle,
            duration: 1000,
            yoyo: false,
            repeat: false,
            onUpdate: () => {
                console.log('Current angle:', sprite.angle);
            }
        });

    }
}

// Configuration for the Phaser game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: GameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
