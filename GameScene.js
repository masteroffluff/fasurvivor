
let enemies
let weapons
let itemPickups
let enemy
let playerSpeed = 100
let playerMaxHitpoints = 100
let cursors;
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
  playerSpeed: 100,
  maxHitpoints: 100,
  armour: 0,
  collectionRadius: 0,
  projectileSpeed: 1,
  damageBonus: 0,
  goldBonus: 0,
  bonusDamage:0,
  bonusPen:0,
  bonusROF:0,
  bonusProjectileSpeed:0,
}


class Item {
  constructor(type, x, y) {
    this.item = itemPickups.create(x, y, type);
    this.item.setDepth(floorItemDepth)
    this.type = this.item.type;
    this.x = this.item.x;
    this.y = this.item.y;
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
  constructor(x, y, value) {
    super('gem1', x, y);
    this.item.onPickup = (player) => {
      console.log(player.xp, gameState.player.xp)
      player.xp += value;
      this.item.destroy();
      if (player.xp >= player.nextLevel) {
        player.level++;
        player.nextLevel = Math.ceil(player.nextLevel * 1.2);
        player.xp = 0;
        return { scene: 'LevelUpScene' }
      }
      return false

    };
  }
}

class WeaponPickup extends Item {
  constructor(x, y, value) {
    super(value, x, y);
    this.item.onPickup = (player) => {
      if (!player.heldWeapons.contains(value)) {
        player.heldWeapons.contains(push)
        weaponLoop(value)
      }
      this.item.destroy();
    };
  }
}
class Chest extends Item {
  constructor(x, y, value) {
    super(value, x, y);
    this.item.onPickup = (player) => {

      this.item.destroy();
    };
  }
}

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
        const { pen, damage } = weaponsData['fireball']
        const fireball = weapons.create(gameState.player.x, gameState.player.y, 'fireball').setScale(0.2)
        fireball.damage = damage
        fireball.pen = pen
        const targeted = enemies.children.getArray()[Math.floor(Math.random() * enemies.children.size)]
        this.physics.moveToObject(fireball, targeted, 100);
      }

    case 'sword':
      return function swingSword() {
        const sword = weapons.create(gameState.player.x, gameState.player.y, 'sword').setOrigin(0, 0.5)
        const { pen, damage } = weaponsData['sword']
        sword.damage = damage
        sword.pen = pen==="Infinity"?Infinity:pen

        const bodyRadius = 15
        sword.body.setCircle(bodyRadius, sword.width - bodyRadius * 2, -(sword.height / 2 + bodyRadius) / 2)
        this.tweens.add({
          targets: sword,
          paused: false,
          angle: -360,
          yoyo: false,
          duration: 750,
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
    default:
  }

}

const heldWeapons = ['fireball'];

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  //// ***** PRELOAD FUNCTION *******
  preload() {
    this.load.json('bonuses', 'data/bonuses.json');
    this.load.json('weapons', 'data/weapons.json');


    this.load.image('enemy1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
    this.load.image('player', 'https://content.codecademy.com/courses/learn-phaser/codey.png')
    this.load.image('fireball', './imgs/fireball.png')
    this.load.image('sword', './imgs/sword3.png')
    this.load.image('gem1', './imgs/gem1.png')
    this.load.image('heart', './imgs/heart.png')
    this.load.pack('bonusesPack','./data/bonusesPack.json')
    this.load.json('weaponsData','./data/weapons.json')

  }
  //// ***** CREATE FUNCTION *******
  create() {
    
    

    //* initial setup
    bonusesData = this.cache.json.get('bonusesData');
    weaponsData = this.cache.json.get('weaponsData');



    if (gameState.player) {
      delete (gameState.player.stats)
      gameState.player.destroy
    }
    this.gameState = {}
    //this.debugGraphics = this.add.graphics();
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x00ffff, 0xff0000, 0xff00ff, 0x00ff00, 1);
    graphics.fillRect(-100, -100, gameState.width, gameState.height).setDepth(-999)

    // *player
    gameState.player = this.physics.add.sprite(200, 450, 'player')
    gameState.player.body.setSize(32, 32, true)           // make the hitbox a touch smaller to make it a bit fairer
    gameState.player.stats = { ...playerStats }           // dump all the stats into the player
    gameState.player.hitpoints = playerStats.maxHitpoints // initialise hitpoints as the current max
    gameState.player.immune = false                       // set state for layer immunity
    gameState.player.xp = 0                               // set up xp 
    gameState.player.nextLevel = 5                        // set next level xp
    gameState.player.level = 0                            // set level
    gameState.player.heldWeapons = heldWeapons;           // load weapons array
    this.cameras.main.startFollow(gameState.player);      // make the camera follow the character




    cursors = this.input.keyboard.createCursorKeys();
    enemies = this.physics.add.group();


    this.physics.add.collider(enemies.children.entries, enemies.children.entries); // collider added to stiop the enemies clumping up
    this.physics.add.overlap(enemies, gameState.player, (pl, enemy) => {
      if (!gameState.player.immune) {
        pl.setTint(0xff0000)
        gameState.player.immune = true
        //console.log(enemy)
        pl.hitpoints -= enemy.data.damage
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
    console.log(playAreaOffset,
      this.cameras.main.worldView.x - playAreaOffset,
      this.cameras.main.worldView.y - playAreaOffset,
      this.cameras.main.worldView.width,
      this.cameras.main.worldView.height
    )
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

    // *enemies

    function generateEnemy() {
      if (enemies.countActive() <= maxEnemies) {

        //this.gameState.cameraView.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(this.gameState.playArea, this.gameState.cameraView)

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
          new Gem(e.x, e.y, e.data.xpGiven);
        }
        gameState.score++

      }

      //console.log(e.data) //}
    })



    const weaponLoop = (weaponName) => {
      console.log(weaponsData, weaponName)
      const weapon2 = weaponsData[weaponName];
      return this.time.addEvent({
        callback: getWeaponCallback(weapon2.name),
        delay: weapon2.delay,
        callbackScope: this,
        loop: true,

      })
    }

    //* Pickups
    itemPickups = this.physics.add.group();

    this.physics.add.collider(itemPickups, gameState.player, (player, item) => {
      console.log(item)
      const r = item.onPickup(player)
      if (r) {
        this.physics.pause();  // Pause the physics
        this.scene.pause();  // Pause the current scene
        this.scene.launch(r.scene, { level: 'GameScene' });  // Start the PauseScene
        this.paused = true;
      }

    })

    // **** game starting conditions *****
    // start hud
    this.scene.launch('HudScene')
    // initalise the enemy genrator
    const enemyGenLoop = this.time.addEvent({
      callback: generateEnemy,
      delay: 100,
      callbackScope: this,
      loop: true,
    });
    gameState.player.heldWeapons.forEach((w) => { // start weapon loops for weapons held at the start
      weaponLoop(w)
    })



    // ***** pause mode ****
    // Initialize a flag to track paused state
    this.paused = false;

    const keyObject = this.input.keyboard.addKey('P');  // Get key object

    keyObject.on('down', () => {
      if (!this.paused) {
        this.physics.pause();  // Pause the physics
        this.scene.pause();  // Pause the current scene
        this.scene.launch('PauseScene', { level: 'GameScene' });  // Start the PauseScene
        this.paused = true;
      }
    });

    this.events.on('resume', () => {
      if (this.paused) {
        this.physics.resume();  // Resume the physics
        this.paused = false;
      }
    }, this);  // Bind the context
  }



  //// ***** UPDATE FUNCTION *******
  update() {
    // this.debugGraphics.clear()
    // this.debugGraphics.lineStyle(2, 0xff0000);
    // this.debugGraphics.strokeRectShape(this.gameState.playArea);
    // this.debugGraphics.lineStyle(2, 0x0000ff);
    // this.debugGraphics.strokeRectShape(this.gameState.cameraView);
    // this.debugGraphics.lineStyle(2, 0xffff00);
    // this.debugGraphics.strokeRectShape(this.cameras.main.worldView);

    // player controls
    // use dx and dy to control the player velocity initially zero as not moving
    let dX = 0, dY = 0
    if (cursors.left.isDown) {
      dX = -1; // we want to apply a negative x velocity to go left on the screen so dx = -1
      gameState.player.flipX = true
    }
    if (cursors.right.isDown) {
      dX = 1; // we want to apply a positive x velocity to go right on the screen so dx = 1
      gameState.player.flipX = false
    }
    if (cursors.up.isDown) {
      dY = -1; // we want to apply a negative y velocity to go up on the screen so dy = -1

    }
    if (cursors.down.isDown) {
      dY = 1; // we want to apply a positive y velocity to go down on the screen sop dy = 1

    }
    // we then multiply dx and dy by the velocityx and velovity y times the speed

    gameState.player.setVelocityX(dX * gameState.player.stats.playerSpeed);
    gameState.player.setVelocityY(dY * gameState.player.stats.playerSpeed);


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



  }

}
