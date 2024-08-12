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
        console.log(this);

        // Access the data from the packs after ensuring they've loaded
        this.bonusesData = this.cache.json.get('bonusesPack.data.bonusesData');
        this.weaponsData = this.cache.json.get('weaponsPack'); // Make sure to load this correctly
        console.log(this.cache.json.get('weaponsPack'))
        // Check if weaponsData was loaded correctly
        if (!this.weaponsData) {
            console.error('weaponsData is not loaded correctly.');
        } else {
            console.log('Weapons Data Loaded:', this.weaponsData);
        }
        this.add.image(400, 300, 'sword');
        // Check if bonusesData is loaded correctly
        if (!this.bonusesData) {
            console.error('bonusesData is not loaded correctly.');
        } else {
            console.log('Bonuses Data Loaded:', this.bonusesData);
        }
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
