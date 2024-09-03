class WorldGenerator {
    constructor(scene, renderDistance) {
        this.scene = scene;
        this.renderDistance = renderDistance;
        this.objectTypes = new Map();
        this.activeObjects = new Map();
        this.genericGroup = scene.add.group();
    }

    addObjectType(key, sprite, spacing, generateProbability = 1, offSet = { x: 0, y: 0 }, collection_ = null, customGenerateFunc = null) {
        try {
            const collection = collection_ || this.genericGroup
            this.objectTypes.set(key, { sprite, spacing, generateProbability, customGenerateFunc, offSet, collection });
        } catch (error) {
            console.log(error)
        }
    }

    update(playerX, playerY) {
        const chunksToRender = this.getChunksInRange(playerX, playerY);
        const visibleChunkKeys = new Set(chunksToRender.map(chunk => `${chunk.x},${chunk.y}`));

        // Remove objects in non-visible chunks
        for (const [chunkKey, objects] of this.activeObjects) {
            if (!visibleChunkKeys.has(chunkKey)) {
                objects.forEach(obj => obj.destroy());
                this.activeObjects.delete(chunkKey);
            }
        }

        // Generate or show objects in visible chunks
        chunksToRender.forEach(chunk => {
            const chunkKey = `${chunk.x},${chunk.y}`;
            if (!this.activeObjects.has(chunkKey)) {
                this.generateObjectsInChunk(chunk);
            }
        });
    }

    getChunksInRange(playerX, playerY) {
        const chunkSize = Math.min(...Array.from(this.objectTypes.values()).map(type => type.spacing));
        const minX = Math.floor((playerX - this.renderDistance) / chunkSize);
        const maxX = Math.ceil((playerX + this.renderDistance) / chunkSize);
        const minY = Math.floor((playerY - this.renderDistance) / chunkSize);
        const maxY = Math.ceil((playerY + this.renderDistance) / chunkSize);

        const chunks = [];
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                chunks.push({ x: x * chunkSize, y: y * chunkSize });
            }
        }
        return chunks;
    }

    generateObjectsInChunk(chunk) {
        const chunkObjects = [];
        this.objectTypes.forEach((type, key) => {
            const { sprite, spacing, generateProbability, customGenerateFunc, offSet, collection } = type;
            for (let x = chunk.x; x < chunk.x + spacing; x += spacing) {
                for (let y = chunk.y; y < chunk.y + spacing; y += spacing) {
                    if (Math.random() < generateProbability) {
                        let obj;
                        if (customGenerateFunc) {
                            obj = customGenerateFunc(this.scene, x + offSet.x, y + offSet.y);
                        } else {
                            obj = collection.create(x + offSet.x, y + offSet.y, sprite);
                        }
                        if (obj) chunkObjects.push(obj);
                    }
                }
            }
        });
        if (chunkObjects.length > 0) {
            this.activeObjects.set(`${chunk.x},${chunk.y}`, chunkObjects);
        }
    }
}


// Usage in your game scene:
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    //// ***** PRELOAD FUNCTION *******
    preload() {

        this.load.image('enemy1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
        this.load.image('player', 'https://content.codecademy.com/courses/learn-phaser/codey.png')
        this.load.spritesheet('bombExplosion', '../imgs/bombExplosion.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('gem1', '../imgs/gem1.png')
        this.load.image('heart', '../imgs/heart.png')
        this.load.image('crate', '../imgs/crate.png')
        this.load.image("background", "../imgs/grassTile.png");
        //this.load.pack('bonusesPack', '../data/bonusesPack.json')
        //this.load.pack('weaponsPack', '../data/weaponsPack.json')

    }

    create() {

        const { width, height } = this.sys.game.config;
        // Create a tile sprite that covers the entire game area
        this.background = this.add.tileSprite(0, 0, width, height, 'background');
        this.background.setOrigin(0, 0);
        this.background.setDepth(-999)
        this.player = this.physics.add.sprite(0, 0, 'player');
        this.player.depth = 10000
        this.cameras.main.startFollow(this.player);
        this.cursors = this.input.keyboard.createCursorKeys();
        // Initialize the procedural generator
        const obstacles = this.physics.add.staticGroup()
        this.physics.add.collider(obstacles,this.player)
        this.worldGenerator = new WorldGenerator(this, 500);
        this.worldGenerator.addObjectType('gem', 'gem', 750, 1, { x: 20, y: 50 });
        this.worldGenerator.addObjectType('heart', 'heart', 500, 0.2, { x: 20, y: 50 });
        this.worldGenerator.addObjectType('crate', 'crate', 250, 0.5, { x: 100, y: 70 },obstacles);

        // Add a custom object type with a custom generation function
        this.worldGenerator.addObjectType('enemy1', 'enemy1', 300, 1, { x: 20, y: 50 }, null, (scene, x, y) => {
            const house = scene.add.sprite(x, y, 'enemy1');
            house.setScale(2);  // Make houses bigger
            return house;
        });
        

    }

    update() {
        // Update player movement here...
        let dX = 0, dY = 0
        if (this.cursors.left.isDown) {
            dX = -1; // we want to apply a negative x velocity to go left on the screen so dx = -1
            this.player.flipX = true
        }
        if (this.cursors.right.isDown) {
            dX = 1; // we want to apply a positive x velocity to go right on the screen so dx = 1
            this.player.flipX = false
        }
        if (this.cursors.up.isDown) {
            dY = -1; // we want to apply a negative y velocity to go up on the screen so dy = -1

        }
        if (this.cursors.down.isDown) {
            dY = 1; // we want to apply a positive y velocity to go down on the screen sop dy = 1

        }
        // we then multiply dx and dy by the velocity x and velovity y times the speed

        this.player.setVelocityX(dX * 100);
        this.player.setVelocityY(dY * 100);
        this.background.x = this.player.x - (this.sys.game.config.width / 2)
        this.background.y = this.player.y - (this.sys.game.config.height / 2)
        this.background.tilePositionX += this.player.body.velocity.x * this.sys.game.loop.delta / 1000;
        this.background.tilePositionY += this.player.body.velocity.y * this.sys.game.loop.delta / 1000;

        // Update the procedural generation
        this.worldGenerator.update(this.player.x, this.player.y);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [GameScene],
    backgroundColor: "aaaaaa",
    physics: {
        default: 'arcade',
        arcade: {
            enableBody: true,
            //debug: true,
        }
    }
};

const game = new Phaser.Game(config);