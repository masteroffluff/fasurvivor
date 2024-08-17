
let enemies
let weapons
let itemPickups
let crates
let enemy
let playerSpeed = 100
//let playerMaxHitpoints = 100
//let cursors;
let emitter;
let particles;
let enemyPool = ['enemy1']
let maxEnemies = 15
const playAreaOffset = 50;



const backgroundDepth = -999;
const floorItemDepth = -99;
const playerDepth = 0;
const enemyDepth = 99;


const enemyData = {
  'enemy1': {
    name: 'enemy1',
    life: 1,
    damage: 1,
    xpGiven: 1
  }
}

const playerStats = {
  startingHitpoints:100,
  playerSpeed: 0,
  maxHitpoints: 0,
  armour: 0,
  collectionRadius: 0,
  projectileSpeed: 0,
  projectileCount: 0,
  damageBonus: 0,
  goldBonus: 0,
  bonusDamage: 0,
  bonusPen: 0,
  bonusROF: 0,
  bonusArea: 0,
}




class Item {
  constructor(type, x, y, context,) {
    this.item = itemPickups.create(x, y, type);
    this.item.setDepth(floorItemDepth)
    this.type = this.item.type;
    this.x = this.item.x;
    this.y = this.item.y;
    this.item.onPickup = () => "";
  }
}

class Heart extends Item {
  constructor(x, y, value) {
    super('heart', x, y);
    this.item.onPickup = () => {
      gameState.player.hitpoints += value;
      this.item.destroy();
    };
  }
}

class Gem extends Item {
  constructor(x, y, value, context) {
    super('gem1', x, y, context);
    this.item.onPickup = (player) => {
      //console.log(player.xp, gameState.player.xp)
      player.xp += value;
      this.item.destroy();
    };

  }
}

class WeaponPickup extends Item {
  constructor(x, y, value, context) {
    super(`icon_${value}`, x, y);
    this.item.setScale(0.5)
    this.type = value
    this.item.onPickup = (player) => {
      // if (!player.heldWeapons.includes(value)) {
      //player.heldWeapons.push(value)
      //context.events.emit('weaponLoop', value)

      // }
      context.events.emit('getWeapon', value)
      this.item.destroy();
    };
  }
}
// class Chest extends Item {
//   constructor(x, y, value) {
//     super(value, x, y);
//     this.item.onPickup = (player) => {

//       this.item.destroy();
//     };
//   }
// }

// class Weapon {
//   constructor(damage, pen, scale, name){
//     this.damage = damage
//     this.pen = pen

//   }

// }

// TODO: turn this into a proper class 
function getWeaponCallback(weaponName) {

  switch (weaponName) {
    case 'fireball':
      return function shootFireball() {
        const { pen, damage } = this.weaponsData['fireball']
        const fireball = weapons.create(gameState.player.x, gameState.player.y, 'fireball').setScale(0.2)
        fireball.damage = damage
        fireball.pen = pen
        const targeted = enemies.children.getArray()[Math.floor(Math.random() * enemies.children.size)]
        this.physics.moveToObject(fireball, targeted,  100*(1+gameState.player.stats.projectileSpeed*0.10));
      }

    case 'sword':
      return function swingSword() {
        const sword = weapons.create(gameState.player.x, gameState.player.y, 'sword').setOrigin(0, 0.5)
        const { pen, damage } = this.weaponsData['sword']
        sword.damage = damage
        sword.pen = pen === "Infinity" ? Infinity : pen

        const bodyRadius = 15 
        sword.body.setCircle(bodyRadius, sword.width - bodyRadius * 2, -(sword.height / 2 + bodyRadius) / 2)
        this.tweens.add({
          targets: sword,
          paused: false,
          angle: -360,
          yoyo: false,
          duration: 750*1-(gameState.player.stats.projectileSpeed*0.10),
          onComplete: () => {
            sword.destroy()
          },
          onUpdate: () => {
            // Update sword position to match player position
            sword.x = gameState.player.x;
            sword.y = gameState.player.y;

            // Radius of the path traced by the sword's tip
            const pathRadius = sword.width; // Adjust as needed for your sword's path

            //const bodyRadius = 20; // set further up the code now

            // Calculate the sword's rotation
            const rotation = sword.rotation;

            // Calculate the tip position using the sword's rotation
            const tipX = pathRadius * Math.cos(rotation);
            const tipY = pathRadius * Math.sin(rotation);

            // The body's center should be positioned so that its edge is aligned with the tip's path
            // The offset is calculated by translating the body's center back from the tip's position
            const offsetX = tipX - bodyRadius * Math.cos(rotation) - bodyRadius;
            const offsetY = tipY - bodyRadius * Math.sin(rotation) + (sword.height / 2) - bodyRadius;

            // Set the new offset for the sword's body
            sword.body.setOffset(Math.floor(offsetX), Math.floor(offsetY));

          }

        })
      }
    case 'bomb':
      return function throwbomb() {
        const { pen, damage } = this.weaponsData['bomb']
        const bomb = this.physics.add.sprite(gameState.player.x, gameState.player.y, 'bomb').setScale(0.2)
        bomb.damage = damage
        bomb.pen = pen
        Phaser.Math.RandomXY(bomb.body.velocity, 100*1-(gameState.player.stats.projectileSpeed*0.10));
        this.tweens.add({
          targets: bomb,
          paused: false,
          angle: 360,
          yoyo: false,
          duration: 750,
          onComplete: () => {
            const bombExplosion = weapons.create(bomb.x, bomb.y, 'bombExplosion')
            bombExplosion.body.setCircle(bombExplosion.width / 2)
            bombExplosion.on('animationcomplete', (e) => {

              bombExplosion.destroy()
            })
            bombExplosion.play('bombExplodes')
            bomb.destroy()

          }
        })
      }
    default:
  }

}

const heldWeapons = ['bomb'];

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  //// ***** PRELOAD FUNCTION *******
  preload() {
    this.load.json('bonusesData', 'data/bonusesData.json');
    this.load.json('weaponsData', 'data/weaponsData.json');


    this.load.image('enemy1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
    this.load.image('player', 'https://content.codecademy.com/courses/learn-phaser/codey.png')
    this.load.spritesheet('bombExplosion', './imgs/bombExplosion.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('gem1', './imgs/gem1.png')
    this.load.image('heart', './imgs/heart.png')
    this.load.image('crate', './imgs/crate.png')
    this.load.image("background", "./imgs/grassTile.png");
    this.load.pack('bonusesPack', './data/bonusesPack.json')
    this.load.pack('weaponsPack', './data/weaponsPack.json')

  }
  //// ***** CREATE FUNCTION *******
  create() {
    function weaponLoop(weaponName) {
      //context = context || this
      const weapon2 = this.weaponsData[weaponName];
      return this.time.addEvent({
        callback: getWeaponCallback(weapon2.name),
        delay: weapon2.delay*(gameState.player.stats.bonusROF),
        callbackScope: this,
        loop: true,

      })
    }
    //this.events.on('weaponLoop', (w) => weaponLoop(w, this))

    // this.events.on('levelUp', (context) => {
    //   console.log(gameState.player.xp)
    //   context.sceneTrigger({ scene: 'LevelUpScene' })
    // })
    //console.log(this)

    //* initial setup
    this.gameState = {}
    this.bonusesData = this.cache.json.get('bonusesData');
    this.weaponsData = this.cache.json.get('weaponsData');
    // var background = this.add.tileSprite(0, 0, 2000, 2000, "background");
    // background.setOrigin(0, 0);

    // Get the width and height of the game
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;

    // Create a tile sprite that covers the entire game area
    this.background = this.add.tileSprite(0, 0, width, height, 'background');
    this.background.setOrigin(0, 0);
    this.background.setDepth(-999)


    // * set up anims here 
    this.anims.create({
      key: 'bombExplodes',
      frames: this.anims.generateFrameNumbers('bombExplosion', { start: 0, end: 4 }),
      frameRate: 10,
    });


    //this.debugGraphics = this.add.graphics();

    // *set up level

    //  const g  = [[0x00f,0x0ff,0x0f0],[0x0f0,0xff0,0xf00], [0x00f,0xf0f,0xf00]]
    //   for(let i = -1;i<=1;i++){
    //     for(let j = -1;j<=1;j++){
    //       const graphics = this.add.graphics();
    //       graphics.fillGradientStyle(g[i+1][j+1], g[i+1][j+1], g[i+1][j+1], g[i+1][j+1], 1);
    //       console.log(i*gameState.width, j*gameState.height,(i+1)*gameState.width, (j+1)*gameState.height)
    //       graphics.fillRect(i*gameState.width, j*gameState.height,(i+1)*gameState.width, (j+1)*gameState.height).setDepth(-999)
    //     }
    //   }


    // *player
    if (gameState.player) {
      delete (gameState.player.stats)
      gameState.player.destroy
    }
    gameState.player = this.physics.add.sprite(200, 450, 'player')
    gameState.player.body.setSize(32, 32, true)           // make the hitbox a touch smaller to make it a bit fairer
    gameState.player.stats = { ...playerStats }           // dump all the stats into the player
    gameState.player.hitpoints = playerStats.startingHitpoints // initialise hitpoints as the current max
    gameState.player.immune = false                       // set state for layer immunity
    gameState.player.xp = 0                               // set up xp 
    gameState.player.nextLevel = 5                        // set next level xp
    gameState.player.level = 0                            // set level
    gameState.player.heldWeapons = [...heldWeapons];           // load weapons array
    gameState.player.heldBonuses = new Map()
    this.cameras.main.startFollow(gameState.player);      // make the camera follow the character


    // set up contols 
    this.cursors = this.input.keyboard.createCursorKeys();
    // add groups for enemies and crates
    enemies = this.physics.add.group();
    crates = this.physics.add.group();


    this.physics.add.collider(enemies.children.entries, enemies.children.entries); // collider added to stiop the enemies clumping up
    this.physics.add.overlap(enemies, gameState.player, (pl, enemy) => {
      if (!gameState.player.immune) {
        pl.setTint(0xff0000)
        gameState.player.immune = true
        //console.log(enemy)
        pl.hitpoints -= enemy.data.damage * (1-pl.stats.armour*0.01)
        if (pl.hitpoints <= 0) {
          // player dead
          //alert("lol u died")
          this.scene.launch('YouDiedScene')
          this.scene.pause()
        }
        this.time.addEvent({
          delay: 10,
          callbackScope: this,
          loop: false,
          callback: () => {
            pl.immune = false
            pl.clearTint()
          }
        });
      }


    });
    // Access game config bounds
    const gameConfig = this.game.config;
    const gameWidth = gameConfig.width;
    const gameHeight = gameConfig.height;
    // console.log(playAreaOffset,
    //   this.cameras.main.worldView.x - playAreaOffset,
    //   this.cameras.main.worldView.y - playAreaOffset,
    //   this.cameras.main.worldView.width,
    //   this.cameras.main.worldView.height
    // )
    this.gameState.playArea = new Phaser.Geom.Rectangle(
      this.cameras.main.worldView.x - playAreaOffset,
      this.cameras.main.worldView.y - playAreaOffset,
      gameWidth + playAreaOffset + playAreaOffset,
      gameHeight + playAreaOffset + playAreaOffset
    );
    // this.gameState.cameraView = new Phaser.Geom.Rectangle(
    //   this.cameras.main.worldView.x,
    //   this.cameras.main.worldView.y,
    //   this.cameras.main.worldView.width,
    //   this.cameras.main.worldView.height
    // );
    this.gameState.cameraView = this.cameras.main.worldView

    //* Weapons 
    weapons = this.physics.add.group();
    this.physics.add.overlap(weapons, enemies, (w, e) => {
      //if(!e.dead){
      w.pen--
      e.data.life--
      if (w.pen <= 0) {
        w.destroy();
      }

      if (e.data.life <= 0) {
        //e.disableBody(e.body) 

        e.body.destroy()
        e.dead = true;
        e.deadTween.restart()
        if (Math.random() > 0.75) {
          new Gem(e.x, e.y, e.data.xpGiven, this);
        }
        gameState.score++

      }

      //console.log(e.data) //}
    })

    //* Pickups
    itemPickups = this.physics.add.group();


    this.physics.add.collider(itemPickups, gameState.player, (player, item) => {
      //console.log(item)
      const r = item.onPickup(player, this)
      // if (r) {
      //   this.physics.pause();  // Pause the physics
      //   this.scene.pause();  // Pause the current scene
      //   this.scene.launch(r.scene, { level: 'GameScene' });  // Start the level up scene
      //   this.paused = true;
      // }

    })
    // * controller function for game

    function director() {
      // * crates

      // * enemies
      if (enemies.countActive() <= maxEnemies) {

        //this.gameState.cameraView.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(this.gameState.playArea, this.gameState.cameraView)
        // crates 


        let randomEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)]
        //enemies.create(xCoord, yCoord, randomEnemy)
        let enemy = enemies.create(spawnPoint.x, spawnPoint.y, randomEnemy)
        enemy.data = { ...enemyData[randomEnemy] }
        enemy.on('destroy', () => {
          delete (enemy.data)
        })
        enemy.setDepth(enemyDepth)
        //enemy.life = 1;
        enemy.deadTween = this.tweens.add({
          targets: enemy,
          paused: true,
          scaleX: 0,
          scaleY: 0,
          yoyo: false,
          duration: 150,
          onComplete: function () {
            //delete(enemy.data)
            enemy.destroy()
          }
        })
      }
    };

    // **** game starting conditions *****
    // level specific setup
    new WeaponPickup(500, 500, 'sword', this)
    new Gem(250, 250, 50, this)
    // start hud
    this.scene.launch('HudScene')
    // initalise the enemy genrator
    const directorLoop = this.time.addEvent({
      callback: director,
      delay: 100,
      callbackScope: this,
      loop: true,
    });


    gameState.player.heldWeapons.forEach((w) => { // start weapon loops for weapons held at the start
      this.events.emit("getWeapon",w)
    })



    // ***** pause mode ****
    // Initialize a flag to track paused state
    this.paused = false;

    const pKey = this.input.keyboard.addKey('P');  // Get key object

    pKey.on('down', () => {
      if (!this.paused) {
        this.physics.pause();  // Pause the physics
        this.scene.pause();  // Pause the current scene
        this.scene.launch('PauseScene', { level: 'GameScene' });  // Start the PauseScene
        this.paused = true;
      }
    });

    this.events.on('resume', () => {
      if (this.paused) {
        this.input.keyboard.resetKeys()
        this.physics.resume();  // Resume the physics
        this.paused = false;
      }
    }, this);  // Bind the context
    this.events.on('getBonus', (b) => {
      const { heldBonuses } = gameState.player
      const bonusObject = this.bonusesData[b]
      if (heldBonuses.has(bonusObject)) {
        heldBonuses.set(bonusObject, heldBonuses.get(bonusObject) + 1)
        heldBonuses.get(bonusObject)
      } else (
        heldBonuses.set(bonusObject, 1)
      )
      const level = heldBonuses.get(bonusObject)

      gameState.player.stats[bonusObject.stat] = level;
    }, this);

    this.events.on('getWeapon', (w) => {
      const {player} = gameState
      console.log(player.heldWeapons)
      if (!player.heldWeapons.includes(w)) {
        player.heldWeapons.push(w)
        weaponLoop.call(this,w)
      }
    })
  }



  //// ***** UPDATE FUNCTION *******
  update() {
    // player controls
    // use dx and dy to control the player velocity initially zero as not moving
    let dX = 0, dY = 0
    if (this.cursors.left.isDown) {
      dX = -1; // we want to apply a negative x velocity to go left on the screen so dx = -1
      gameState.player.flipX = true
    }
    if (this.cursors.right.isDown) {
      dX = 1; // we want to apply a positive x velocity to go right on the screen so dx = 1
      gameState.player.flipX = false
    }
    if (this.cursors.up.isDown) {
      dY = -1; // we want to apply a negative y velocity to go up on the screen so dy = -1

    }
    if (this.cursors.down.isDown) {
      dY = 1; // we want to apply a positive y velocity to go down on the screen sop dy = 1

    }
    // we then multiply dx and dy by the velocityx and velovity y times the speed

    gameState.player.setVelocityX(dX * playerSpeed * (1 + gameState.player.stats.playerSpeed * 0.1));
    gameState.player.setVelocityY(dY * playerSpeed * (1 + gameState.player.stats.playerSpeed * 0.1));

    this.background.x = gameState.player.x - (this.sys.game.config.width / 2)
    this.background.y = gameState.player.y - (this.sys.game.config.height / 2)
    this.background.tilePositionX += gameState.player.body.velocity.x * this.sys.game.loop.delta / 1000;
    this.background.tilePositionY += gameState.player.body.velocity.y * this.sys.game.loop.delta / 1000;

    // set an area for weapons and enemies to exist any item outside this box gets deleted

    this.gameState.playArea.setPosition(this.cameras.main.worldView.x - playAreaOffset, this.cameras.main.worldView.y - playAreaOffset)
    // Enemies
    // enemy controls

    enemies.children.each((enemy) => {
      if (Phaser.Geom.Rectangle.Contains(this.gameState.playArea, enemy.x, enemy.y)) {

        if (enemy.data.life > 0) {
          this.physics.moveToObject(enemy, gameState.player, 50);

        } else {
          //enemy.deadTween.restart() 
        }
      } else {
        //delete(enemy.data)
        enemy.destroy()
      }

    })
    weapons.children.each((weapon) => {
      if (!Phaser.Geom.Rectangle.Contains(this.gameState.playArea, weapon.x, weapon.y)) {
        weapon.destroy()
      }
    })
    const player = gameState.player
    // handle level up
    if (player.xp >= player.nextLevel) {
      this.physics.pause();  // Pause the physics
      this.scene.pause();  // Pause the current scene
      this.scene.launch("LevelUpScene", { level: 'GameScene' });  // Start the level up scene
      this.paused = true;
      player.level++;
      player.maxHitpoints = 100 + (player.maxHitpoints * 0.01)
      player.hitpoints *= 1.01

      player.xp -= player.nextLevel;
      player.nextLevel = Math.ceil(player.nextLevel * 1.2);
    }

  }

}

