let enemies;
let weapons;
let itemPickups;
let crates;
let enemy;
let playerSpeed = 100;

let emitter;
let particles;
let enemyPool = [];
let level = 0;

const heldWeapons = ["fireball"];
let maxEnemies = 15;

const playAreaOffset = 50;

//let timer = 0;

const backgroundDepth = -999;
const floorItemDepth = -99;
const playerDepth = 0;
const enemyDepth = 99;
const controllerDepth = 999;

//var isClicking = false;

const playerStats = {
  startingHitpoints: 100,
  playerSpeed: 0,
  maxHitpointsBonus: 0, // note this is the level for max hp NOT the max hp itself
  armour: 0,
  collectionRadius: 0,
  projectileSpeed: 0,
  projectileCount: 0,
  // goldBonus: 0, // todo: add gold
  scoreBonus: 0,
  bonusDamage: 0,
  bonusPen: 0,
  bonusROF: 0,
  bonusArea: 0,
  bonusLuck: 0,
};

class Item {
  constructor(type, x, y, context) {
    // note contecxt should always be the this from the scene clas.
    this.item = itemPickups.create(x, y, type);
    this.item.setDepth(floorItemDepth);
    this.type = this.item.type;
    this.x = this.item.x;
    this.y = this.item.y;
    this.item.onPickup = () => "";
    this.item.vaccumable = true;
    this.item.vacuumTween = context.tweens.add({
      targets: this.item,
      paused: true,
      yoyo: false,
      angle: 360,
      repeat: -1,
      onUpdate: () => {
        context.physics.moveToObject(this.item, gameState.player, 200);
      },
    });
    this.item.onVacuum = () => {
      this.item.vacuumTween.restart();
    };
  }
}

class Heart extends Item {
  constructor(x, y, value, context) {
    super("heart", x, y, context);
    this.value = parseInt(value);

    this.item.onPickup = () => {
      //console.log(this.value,gameState.player.hitpoints )
      const tempHitpoints = gameState.player.hitpoints;
      gameState.player.hitpoints = Math.min(
        tempHitpoints + this.value,
        gameState.player.maxHitpoints
      );
      this.item.vacuumTween.stop();
      this.item.destroy();
    };
  }
}

class Gem extends Item {
  constructor(x, y, value, context) {
    super("gem1", x, y, context);
    this.item.onPickup = (player) => {
      player.xp += value;
      this.item.vacuumTween.stop();
      this.item.destroy();
    };
  }
}

class WeaponPickup extends Item {
  constructor(x, y, value, context) {
    super(`icon_${value}`, x, y, context);
    this.item.setScale(0.5);
    this.type = value;
    this.item.vaccumable = false;
    this.item.onPickup = (player) => {
      context.paused = true;
      context.physics.pause(); // Pause the physics
      context.scene.pause(); // Pause the current scene
      context.scene.launch("PickUpItemScene", {
        level: "GameScene",
        type: "weapon",
        value,
      });
      context.events.emit("getWeapon", value);
      this.item.destroy();
    };
  }
}

class BonusPickup extends Item {
  constructor(x, y, value, context) {
    super(`icon_${value}`, x, y);
    this.item.setScale(0.5);
    this.type = value;
    this.item.onPickup = (player) => {
      context.paused = true;
      context.physics.pause(); // Pause the physics
      context.scene.pause(); // Pause the current scene
      context.scene.launch("PickUpItemScene", {
        level: "GameScene",
        type: "bonus",
        value,
      });
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

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.waves = [
      {
        enemyPool: ["enemy1"],
        maxEnemies: 5,
        waveLengthSeconds: 30,
        healthBugChance: 0,
      },
      {
        enemyPool: ["enemy1"],
        maxEnemies: 15,
        waveLengthSeconds: 90,
        healthBugChance: 0,
      },
      {
        enemyPool: ["enemy1", "enemy1", "enemy1", "enemy1", "enemy2"],
        maxEnemies: 15,
        waveLengthSeconds: 90,
        healthBugChance: 1,
      },
      {
        enemyPool: ["enemy1", "enemy1", "enemy1", "enemy1", "enemy2", "enemy2"],
        maxEnemies: 15,
        waveLengthSeconds: 90,
        healthBugChance: 1,
      },
      {
        enemyPool: ["enemy1", "enemy2"],
        maxEnemies: 15,
        waveLengthSeconds: 90,
        healthBugChance: 1,
      },
      {
        enemyPool: ["enemy2", "enemy2", "enemy2", "enemy2", "enemy1", "enemy1"],
        maxEnemies: 15,
        waveLengthSeconds: 90,
        healthBugChance: 0.5,
      },
      {
        enemyPool: ["enemy1"],
        maxEnemies: 50,
        waveLengthSeconds: 15,
        healthBugChance: 0.5,
      },
      {
        enemyPool: ["enemy1"],
        maxEnemies: 50,
        waveLengthSeconds: 15,
        healthBugChance:0.5,
      },      
      {
        enemyPool: ["enemy2", "enemy2", "enemy2", "enemy2", "enemy1", "enemy1"],
        maxEnemies: 30,
        waveLengthSeconds: 90,
        healthBugChance: 0.2,
      },
      {
        enemyPool: ["enemy2", "enemy2", "enemy2", "enemy2", "enemy2", "enemy1"],
        maxEnemies: 45,
        waveLengthSeconds: 90,
        healthBugChance: 0.2,
      },
      {
        enemyPool: ["enemy2"],
        maxEnemies: 45,
        waveLengthSeconds: 90,
        healthBugChance: 1,
      },
    ];

    this.currentWaveIndex = 0;

    this.enemyData = {
      enemy1: {
        name: "enemy1",
        speed: 50,
        life: 2,
        damage: 1,
        xpGiven: 1,
        scale: 1,
        value: 1,
        isBoss: false,
        healthGiven: 0,
      },
      enemy2: {
        name: "enemy2",
        speed: 50,
        life: 5,
        damage: 2,
        xpGiven: 3,
        scale: 1,
        value: 2,
        isBoss: false,
        healthGiven: 0,
      },
      boss1: {
        name: "enemy2",
        speed: 50,
        life: 10,
        damage: 5,
        xpGiven: 10,
        scale: 2,
        value: 10,
        isBoss: true,
        healthGiven: 0,
      },
      healthBug: {
        name: "healthBug",
        speed: 15,
        life: 10,
        damage: 5,
        xpGiven: 10,
        scale: 1,
        value: 10,
        isBoss: false,
        healthGiven: 20,
      },
      healthBug: {
        name: "healthBug",
        speed: 15,
        life: 10,
        damage: 5,
        xpGiven: 10,
        scale: 1,
        value: 10,
        isBoss: false,
        healthGiven: 20,
      }
    };
  }
  d;
  getWave() {
    this.wave = this.waves[this.currentWaveIndex];
    this.currentWaveIndex++;
    this.waveLoop = this.time.addEvent({
      callback: this.getWave,
      delay: this.wave.waveLengthSeconds * 1000,
      callbackScope: this,
      loop: false,
    });
  }
  // calculateDelay(weaponName) {
  //   const weapon2 = this.weaponsData[weaponName];
  //   return weapon2.delay * (1 - gameState.player.stats.bonusROF * 0.01);
  // };
  // calculateDelay(weaponName){
  //   return this.getWeaponDetails(weaponName).delay
  // }
  getWeaponDetails(weaponName) {
    const weaponData = this.weaponsData[weaponName];
    const level = gameState.player.heldWeapons.get(weaponData);
    const {
      pen,
      damage: baseDamage,
      levels,
      spriteName,
      velocity,
      delay: baseDelay,
      scale: baseScale,
    } = weaponData;
    const weaponBonus = {};
    for (let i = 1; i <= level; i++) {
      Object.assign(weaponBonus, levels[i - 1].bonus);
    }
    //console.log(weaponName, weaponBonus, level);
    const bonusROF = weaponBonus.rof || 0;
    const bonusDamage = weaponBonus.damage || 0;
    const bonusAmount = weaponBonus.amount || 0;
    const bonusProjSpeed = weaponBonus.proj_speed || 0;
    const bonusArea = weaponBonus.area || 0;
    const bonusLuck = weaponBonus.luck || 0;

    const damage =
      baseDamage *
      (1 + (gameState.player.stats.bonusDamage + bonusDamage) * 0.1);
    const amount = gameState.player.stats.projectileCount + bonusAmount;
    const projSpeed =
      velocity *
      (1 + (gameState.player.stats.projectileSpeed + bonusProjSpeed) * 0.1);
    const area =
      baseScale + (bonusArea + gameState.player.stats.bonusArea) * 0.1;
    const luck = (bonusLuck + gameState.player.stats.bonusLuck) * 0.1;
    const delay =
      baseDelay * (1 - (gameState.player.stats.bonusROF + bonusROF) * 0.01);

    return { damage, pen, amount, projSpeed, area, luck, delay };
  }
  getWeaponCallback(weaponName) {
    switch (("get,", weaponName)) {
      case "fireball":
        return function shootFireball() {
          const { damage, pen, amount, projSpeed, area, luck, delay } =
            this.getWeaponDetails(weaponName);
          if (gameState.player.weaponLoops[weaponName]) {
            gameState.player.weaponLoops[weaponName].delay = delay;
          }
          //console.log(amount);
          for (let index = 0; index <= amount; index++) {
            const sprite = weapons
              .create(gameState.player.x, gameState.player.y, weaponName)
              .setScale(0.2 + gameState.player.stats.bonusArea * 0.1);
            sprite.damage = damage;
            sprite.pen = pen;
            const targeted =
              enemies.children.getArray()[
                Math.floor(Math.random() * enemies.children.size)
              ];
            if (targeted) {
              this.physics.moveToObject(sprite, targeted, projSpeed);
            } else {
              Phaser.Math.RandomXY(sprite.body.velocity, projSpeed);
            }
          }
        };

      case "sword":
        return function swingSword() {
          const { damage, pen, amount, projSpeed, area, luck, delay } =
            this.getWeaponDetails(weaponName);

          if (gameState.player.weaponLoops[weaponName]) {
            gameState.player.weaponLoops[weaponName].delay = delay;
          }

          const ang = 360 / (gameState.player.stats.projectileCount + 1);

          for (let angle = 0; angle < 360; angle += ang) {
            const sprite = weapons
              .create(gameState.player.x, gameState.player.y, weaponName)
              .setOrigin(0, 0.5)
              .setScale(area);

            sprite.angle = -angle;
            sprite.damage = damage;
            sprite.pen = Infinity;

            const bodyRadius = 15;
            sprite.body.setCircle(
              bodyRadius,
              sprite.width - bodyRadius * 2,
              -(sprite.height / 2 + bodyRadius) / 2
            );
            this.tweens.add({
              targets: sprite,
              paused: false,
              angle: -405 + sprite.angle,
              yoyo: false,
              duration: 750 * (1 / projSpeed),
              onComplete: () => {
                sprite.destroy();
              },
              onUpdate: () => {
                // Update sword position to match player position
                sprite.x = gameState.player.x;
                sprite.y = gameState.player.y;
                // Radius of the path traced by the sword's tip
                const pathRadius = sprite.width; // Adjust as needed for your sword's path
                // Calculate the sword's rotation
                const rotation = sprite.rotation;
                // Calculate the tip position using the sword's rotation
                const tipX = pathRadius * Math.cos(rotation);
                const tipY = pathRadius * Math.sin(rotation);
                // The body's center should be positioned so that its edge is aligned with the tip's path
                // The offset is calculated by translating the body's center back from the tip's position
                const offsetX =
                  tipX - bodyRadius * Math.cos(rotation) - bodyRadius;
                const offsetY =
                  tipY -
                  bodyRadius * Math.sin(rotation) +
                  sprite.height / 2 -
                  bodyRadius;
                // Set the new offset for the sword's body
                sprite.body.setOffset(Math.floor(offsetX), Math.floor(offsetY));
              },
            });
          }
        };
      case "bomb":
        return function throwbomb() {
          const { damage, pen, amount, projSpeed, area, luck, delay } =
            this.getWeaponDetails(weaponName);
          if (gameState.player.weaponLoops[weaponName]) {
            gameState.player.weaponLoops[weaponName].delay = delay;
          }
          for (let index = 0; index <= amount; index++) {
            const bomb = this.physics.add
              .sprite(gameState.player.x, gameState.player.y, weaponName)
              .setScale(0.2);

            Phaser.Math.RandomXY(bomb.body.velocity, projSpeed);
            this.tweens.add({
              targets: bomb,
              paused: false,
              angle: 360,
              yoyo: false,
              duration: 750,
              onComplete: () => {
                const bombExplosion = weapons
                  .create(bomb.x, bomb.y, "bombExplosion")
                  .setScale(area);
                bombExplosion.damage = damage;
                bombExplosion.body.setCircle(bombExplosion.width / 2);
                bombExplosion.on("animationcomplete", (e) => {
                  bombExplosion.destroy();
                });
                bombExplosion.play("bombExplodes");
                bomb.destroy();
              },
            });
          }
        };

      case "foot":
        return function putFootDown() {
          const { damage, pen, amount, projSpeed, area, luck, delay } =
            this.getWeaponDetails(weaponName);
          if (gameState.player.weaponLoops[weaponName]) {
            gameState.player.weaponLoops[weaponName].delay = delay;
          }
          const foot = this.physics.add
            .sprite(gameState.player.x, gameState.player.y - 300, "foot")
            .setOrigin(0.5, 1);
          this.tweens.add({
            targets: foot,
            paused: false,
            y: gameState.player.y + 100,
            yoyo: true,
            duration: 400,
            onComplete: () => {
              foot.destroy();
            },
            onYoyo: () => {
              const goodProc = Math.random() > 0.5 - luck;
              enemies.children.each((e) => {
                e.kill(goodProc);
              });
            },
          });
        };
      case "banana":
        return function flingBanana(rept = null) {
          const { damage, pen, amount, projSpeed, area, luck, delay } =
            this.getWeaponDetails(weaponName);
          if (gameState.player.weaponLoops[weaponName]) {
            gameState.player.weaponLoops[weaponName].delay = delay;
          }

          for (let index = 0; index <= amount; index++) {
            const sprite = weapons
              .create(gameState.player.x, gameState.player.y, weaponName)
              .setScale(area);
            sprite.damage = damage;
            sprite.pen = pen;
            //let bananaX = gameState.player.x;
            sprite.bananaFlip = false;
            sprite.offset = 1;
            sprite.orientationX = gameState.player.flipX ? -1 : 1;
            sprite.setVelocityX = projSpeed * sprite.orientationX;
            const bananarang = this.tweens.add({
              name: "bananarang",
              targets: sprite,
              paused: false,
              angle: 360,
              yoyo: false,
              repeat: -1,
              duration: 150,
              // onYoyo:()=>{
              //   sprite.setVelocityX = -projSpeed * sprite.orientationX
              // },
              onUpdate: () => {
                if (sprite.body) {
                  sprite.setVelocityY(gameState.player.body.velocity.y * 0.75);
                }
                sprite.y = gameState.player.y;
                if (!sprite.bananaFlip) {
                  sprite.offset++;
                } else {
                  sprite.offset--;
                }
                sprite.x =
                  sprite.offset * sprite.orientationX * 3 + gameState.player.x;
                if (Math.abs(sprite.x - gameState.player.x) > 200) {
                  //sprite.setTint(0x000)
                  sprite.bananaFlip = true;
                }
                if (sprite.offset <= 0) {
                  bananarang.stop();
                  sprite.destroy();
                }
              },
            });
          }
          if (rept === null) {
            rept = amount;
          }

          if (rept > 0) {
            this.time.addEvent({
              callback: () => {
                flingBanana.call(this, rept - 1);
              },
              delay: 100,
              callbackScope: this,
              loop: false,
            });
          }
        };

      default:
        return function genericAction() {
          const { damage, pen, amount, projSpeed, area, luck, delay } =
            this.getWeaponDetails(weaponName);
          if (gameState.player.weaponLoops[weaponName]) {
            gameState.player.weaponLoops[weaponName].delay = delay;
          }
          for (
            let index = 0;
            index <= gameState.player.stats.projectileCount;
            index++
          ) {
            const sprite = weapons
              .create(gameState.player.x, gameState.player.y, weaponName)
              .setScale(0.2 + gameState.player.stats.bonusArea * 0.1);
            sprite.damage =
              damage * (1 + gameState.player.stats.bonusDamage * 0.1);
            sprite.pen = pen * (1 + gameState.player.stats.bonusPen * 0.1);
          }
        };
    }
  }
  //// ***** PRELOAD FUNCTION *******
  // moved to boot scene

  //// ***** CREATE FUNCTION *******
  create() {
    function weaponLoop(weaponName) {
      //context = context || this
      //const weapon2 = this.weaponsData[weaponName];
      //this.getWeaponCallback(weaponName).call(this);
      return this.time.addEvent({
        callback: this.getWeaponCallback(weaponName),
        delay: this.getWeaponDetails(weaponName).delay,
        callbackScope: this,
        loop: true,
      });
    }

    //* initial setup
    this.gameState = {};
    this.idempotenceFlag = true; // make sure only one bonus or weapon event happens at a time
    this.bonusesData = this.cache.json.get("bonusesData");
    this.weaponsData = this.cache.json.get("weaponsData");

    // Get the width and height of the game
    const { width, height } = this.sys.game.config;

    // Create a tile sprite that covers the entire game area
    this.background = this.add.tileSprite(0, 0, width, height, "background");
    this.background.setOrigin(0, 0);
    this.background.setDepth(-999);

    // * set up anims here
    this.anims.create({
      key: "bombExplodes",
      frames: this.anims.generateFrameNumbers("bombExplosion", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
    });

    // *set up events
    // ***** pause mode ****
    // Initialize a flag to track paused state
    this.paused = false;

    const pKey = this.input.keyboard.addKey("P"); // Get key object
    pKey.on("down", () => {
      if (!this.paused) {
        this.physics.pause(); // Pause the physics
        this.scene.pause(); // Pause the current scene
        this.scene.launch("PauseScene", { level: "GameScene" }); // Start the PauseScene
        this.paused = true;
      }
    });

    this.events.on(
      "resume",
      () => {
        if (this.paused) {
          this.idempotenceFlag = true;
          this.input.keyboard.resetKeys();
          this.physics.resume(); // Resume the physics
          this.paused = false;
        }
      },
      this
    ); // Bind the context

    // *** pick up items/weapons

    this.events.on(
      "getBonus",
      (b) => {
        if (this.idempotenceFlag) {
          this.idempotenceFlag = false;
          const { heldBonuses } = gameState.player;

          const bonusObject = this.bonusesData[b];

          if (heldBonuses.has(bonusObject)) {
            heldBonuses.set(bonusObject, heldBonuses.get(bonusObject) + 1);
            heldBonuses.get(bonusObject);
          } else {
            heldBonuses.set(bonusObject, 1);
          }
          const level = heldBonuses.get(bonusObject);

          gameState.player.stats[bonusObject.stat] = level;
          if (bonusObject.stat === "collectionRadius") {
            gameState.vacuum.body.setCircle(
              75 + gameState.player.stats.collectionRadius * 20
            );
            gameState.vacuum.body.setOffset(
              gameState.vacuum.width / 2 - gameState.vacuum.body.radius,
              gameState.vacuum.height / 2 - gameState.vacuum.body.radius
            );
          }
        }
      },
      this
    );

    this.events.on(
      "getWeapon",
      (w) => {
        if (this.idempotenceFlag) {
          this.idempotenceFlag = false;
          // const { player } = gameState;

          const weaponObject = this.weaponsData[w.trim()];
          if (!gameState.player.heldWeapons.has(weaponObject)) {
            gameState.player.heldWeapons.set(weaponObject, 1);
            gameState.player.weaponLoops[weaponObject] = weaponLoop.call(
              this,
              weaponObject.name
            ); // creates a weaponloop for the weapon and adds it to the weaponloops hashmap
          } else {
            gameState.player.heldWeapons.set(
              weaponObject,
              gameState.player.heldWeapons.get(weaponObject) + 1
            );
          }
        }
      },
      this
    );

    this.events.on("generateGem", (w) => {}, this);

    gameState.player = this.physics.add.sprite(200, 450, "player");

    gameState.player.body.setSize(32, 32, true); // make the hitbox a touch smaller to make it a bit fairer
    gameState.player.stats = { ...playerStats }; // dump all the stats into the player
    gameState.player.hitpoints = playerStats.startingHitpoints; // initialise hitpoints as the current max
    gameState.player.maxHitpoints = playerStats.startingHitpoints; // initialise max hitpoints as the current max
    gameState.player.immune = false; // set state for layer immunity
    gameState.player.xp = 0; // set up xp
    gameState.kills = 0; // reset kill count
    gameState.player.nextLevel = 5; // set next level xp
    gameState.player.level = 0; // set level
    //gameState.player.heldWeapons = [...heldWeapons];           // load weapons array
    gameState.player.heldWeapons = new Map();
    gameState.player.weaponLoops = {};
    gameState.player.heldBonuses = new Map();
    // set up the vacuum
    gameState.vacuum = this.physics.add.sprite(200, 450, "player");
    gameState.vacuum.setTint(0x000);
    gameState.vacuum.visible = false;
    gameState.vacuum.body.setCircle(
      75 + gameState.player.stats.collectionRadius * 20
    );
    gameState.vacuum.body.setOffset(
      gameState.vacuum.width / 2 - gameState.vacuum.body.radius,
      gameState.vacuum.height / 2 - gameState.vacuum.body.radius
    );

    this.cameras.main.startFollow(gameState.player); // make the camera follow the character

    // set up contols
    this.cursors = this.input.keyboard.createCursorKeys();
    // add groups for enemies and crates
    enemies = this.physics.add.group();
    crates = this.physics.add.group();

    this.physics.add.collider(
      enemies.children.entries,
      enemies.children.entries
    ); // collider added to stiop the enemies clumping up
    this.physics.add.overlap(enemies, gameState.player, (pl, enemy) => {
      if (!gameState.player.immune) {
        pl.setTint(0xff0000);
        gameState.player.immune = true;

        pl.hitpoints -= enemy.data.damage * (1 - pl.stats.armour * 0.01);
        if (pl.hitpoints <= 0) {
          // player dead
          this.scene.launch("YouDiedScene");
          this.scene.pause();
        }
        this.time.addEvent({
          delay: 10,
          callbackScope: this,
          loop: false,
          callback: () => {
            pl.immune = false;
            pl.clearTint();
          },
        });
      }
    });
    // Access game config bounds
    const gameConfig = this.game.config;
    const gameWidth = gameConfig.width;
    const gameHeight = gameConfig.height;
    this.gameState.playArea = new Phaser.Geom.Rectangle(
      this.cameras.main.worldView.x - playAreaOffset,
      this.cameras.main.worldView.y - playAreaOffset,
      gameWidth + playAreaOffset + playAreaOffset,
      gameHeight + playAreaOffset + playAreaOffset
    );

    this.gameState.cameraView = this.cameras.main.worldView;

    //* Weapons
    weapons = this.physics.add.group();
    this.physics.add.overlap(weapons, enemies, (w, e) => {
      w.pen--;
      e.data.life -= w.damage;
      if (w.pen <= 0) {
        w.destroy();
      }

      if (e.data.life <= 0) {
        e.kill();
      } else {
        e.stun(100);
      }
    });

    //* Pickups
    itemPickups = this.physics.add.group();

    this.physics.add.collider(itemPickups, gameState.player, (player, item) => {
      const r = item.onPickup(player, this);
    });
    this.physics.add.overlap(itemPickups, gameState.vacuum, (player, item) => {
      if (item.vaccumable) {
        item.vaccumable = false;
        const r = item.onVacuum();
      }
    });
    // * set up pointer controls
    this.pointerController = this.physics.add
      .sprite(0, 0, "playerController")
      .setOrigin(0.5, 0.5)
      .setVisible(false) // Initially hidden
      .setDepth(controllerDepth);

    this.pointerController.relX = 0;
    this.pointerController.relY = 0;

    // Flag to track pointer state
    this.isClicking = false;

    // Register a single pointerdown and pointerup event listener
    this.input.on("pointerdown", (pointer) => {
      if (!this.isClicking) {
        this.isClicking = true;
        this.pointerController.setVisible(true);

        // Set initial pointerController position
        this.pointerController.x = Math.floor(pointer.worldX);
        this.pointerController.y = Math.floor(pointer.worldY);

        // Calculate relative position to the player
        this.pointerController.relX =
          this.pointerController.x - gameState.player.x;
        this.pointerController.relY =
          this.pointerController.y - gameState.player.y;
      }
    });

    this.input.on("pointerup", () => {
      this.pointerController.setVisible(false);
      this.isClicking = false;
    });
    //TODO: add pointer event here
    this.input.on("pointermove", (pointer) => {
      if (this.isClicking) {
        //const { worldX, worldY } = this.input.activePointer;
        const camera = this.cameras.main;

        // Adjust pointer position for camera scroll
        const worldX = this.input.activePointer.x + camera.scrollX;
        const worldY = this.input.activePointer.y + camera.scrollY;

        this.pointerController.setX(
          Math.floor(this.pointerController.relX + gameState.player.x)
        );
        this.pointerController.setY(
          Math.floor(this.pointerController.relY + gameState.player.y)
        );
        let distance = Infinity;
        if (
          Phaser.Geom.Rectangle.Contains(
            this.pointerController.getBounds(),
            this.input.activePointer.x,
            this.input.activePointer.y
          )
        ) {
          distance = Phaser.Math.Distance.Between(
            this.pointerController.x,
            this.pointerController.y,
            worldX,
            worldY
          );
        }

        if (distance > 10) {
          this.pointerController.setFrame(0);
          // Calculate the angle between the pointerController and the touch position
          const angle = Phaser.Math.Angle.Between(
            this.pointerController.x,
            this.pointerController.y,
            worldX,
            worldY
          );
          this.pointerController.rotation = angle;
          // Apply velocity in the direction of the angle
          this.physics.velocityFromRotation(
            angle,
            playerSpeed * (1 + gameState.player.stats.playerSpeed * 0.1),
            gameState.player.body.velocity
          );
          const vx = gameState.player.body.velocity.x;
          const vy = gameState.player.body.velocity.y;
          this.pointerController.setVelocity(vx,vy)
          gameState.player.flipX = gameState.player.body.velocity.x<0;
        } else {
          this.pointerController.setFrame(1);
        }
      }
    });

    // **** game starting conditions *****

    // start hud
    this.scene.launch("HudScene");
    this.scene.get("HudScene").events.emit("UpdateHudItemTB"); // sent the event to tell the hud to update
    // initalise the enemy genrator
    this.currentWaveIndex = 0;
    // start the director
    const directorLoop = this.time.addEvent({
      callback: this.director,
      delay: 100,
      callbackScope: this,
      loop: true,
    });

    heldWeapons.forEach((w) => {
      // start weapon loops for weapons held at the start
      this.events.emit("getWeapon", w);
      this.idempotenceFlag = true;
    });

    this.events.on("shutdown", () => {
      gameState.player = null; // Reset player on scene shutdown
      delete this.wave;
      this.waveLoop.destroy();
    });

    // level specific setup
    new WeaponPickup(500, 500, "sword", this);
    // new Gem(250, 250, 200, this)
    // new Heart(250, 250, 200, this);
  }

  //// DIRECTOR FUNCTION /////

  director() {
    // this is a separate function to the updates as we don't need it running every frame.
    // * crates and objects

    // * enemies
    if (!this.wave) {
      this.getWave();
    }

    const enemyCount = enemies.countActive();
    if (enemyCount <= this.wave.maxEnemies) {
      for (let i = enemyCount; i < this.wave.maxEnemies; i++) {
        //this.gameState.cameraView.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(
          this.gameState.playArea,
          this.gameState.cameraView
        );
        // crates
        
        let randomEnemy =
          this.wave.enemyPool[
            Math.floor(Math.random() * this.wave.enemyPool.length)
          ];
        //enemies.create(xCoord, yCoord, randomEnemy)
        const healthBugBoost =
          (1 - gameState.player.hitpoints / gameState.player.maxHitpoints) *  this.wave.healthBugChance;
        if (Math.random() * 100 < this.wave.healthBugChance + healthBugBoost) {
          console.log("healthbug spawned");
          randomEnemy = "healthBug";
        }
        let enemy = enemies.create(spawnPoint.x, spawnPoint.y, randomEnemy);
        enemy.data = { ...this.enemyData[randomEnemy] };
        enemy.state = "ok";
        enemy.stun = (time) => {
          enemy.status = "stunned";
          enemy.setTint(0xffffff);
          this.time.addEvent({
            callback: () => {
              if (enemy.state === "stunned") {
                enemy.state = "ok";
                enemy.clearTint();
              }
            },
            delay: time,
            callbackScope: this,
            loop: false,
          });
        };
        // TODO: add health drop
        enemy.kill = (goodProc = true) => {
          //enemy.body.destroy()
          if (enemy.state != "dead") {
            gameState.kills++;
            gameState.score += Math.ceil(
              enemy.data.value *
                (1 +
                  gameState.player.stats.scoreBonus *
                    this.bonusesData.investments.amt)
            );
            enemy.state = "dead";
            enemy.deadTween.play();
            if (goodProc) {
              if (enemy.data.healthGiven > 0) {
                new Heart(enemy.x, enemy.y, enemy.data.healthGiven, this);
              }
              if (
                Math.random() + gameState.player.stats.bonusLuck * 0.1 >0.75
              ) {
                // if(enemy.healthGiven){
                //   new Heart(enemy.x, enemy.y, enemy.data.healthGiven, this)
                // } else {
                new Gem(enemy.x, enemy.y, enemy.data.xpGiven, this);
                // }
              }
            }
          }
        };
        enemy.on("destroy", () => {
          delete enemy.data;
        });

        enemy.setDepth(enemyDepth);
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
            enemy.destroy();
          },
        });
      }
    }
  }

  //// ***** UPDATE FUNCTION *******
  update() {
    // player controls
    // Reset player velocity
    if (!this.isClicking) {
      gameState.player.setVelocity(0);
      // * keyboard contols
      // use dx and dy to control the player velocity initially zero as not movin
      let direction = 0;
      let dX = 0,
        dY = 0,
        keyPressed = false;
      var keyObjects = this.input.keyboard.addKeys({
        up: "W",
        down: "S",
        left: "A",
        right: "D",
      });

      if (this.cursors.left.isDown || keyObjects.left.isDown) {
        dX = -1; // we want to apply a negative x velocity to go left on the screen so dx = -1
        // gameState.player.flipX = true;
        keyPressed = true;
      }
      if (this.cursors.right.isDown || keyObjects.right.isDown) {
        dX = 1; // we want to apply a positive x velocity to go right on the screen so dx = 1
        // gameState.player.flipX = false;
        keyPressed = true;
      }
      if (this.cursors.up.isDown || keyObjects.up.isDown) {
        dY = -1; // we want to apply a negative y velocity to go up on the screen so dy = -1
        keyPressed = true;
      }
      if (this.cursors.down.isDown || keyObjects.down.isDown) {
        dY = 1; // we want to apply a positive y velocity to go down on the screen sop dy = 1
        keyPressed = true;
      }
      // we then multiply dx and dy by the velocityx and velovity y times the speed
      if (keyPressed) {
        const angle = Phaser.Math.Angle.Between(0, 0, dX, dY);
        this.physics.velocityFromRotation(
          angle,
          playerSpeed * (1 + gameState.player.stats.playerSpeed * 0.1),
          gameState.player.body.velocity
        );
        gameState.player.flipX = gameState.player.body.velocity.x<0;
      }
      
    }
    
    // make the vacuum follow the player
    gameState.vacuum.x = gameState.player.x;
    gameState.vacuum.y = gameState.player.y;

    this.background.x = gameState.player.x - this.sys.game.config.width / 2;
    this.background.y = gameState.player.y - this.sys.game.config.height / 2;
    this.background.tilePositionX +=
      (gameState.player.body.velocity.x * this.sys.game.loop.delta) / 1000;
    this.background.tilePositionY +=
      (gameState.player.body.velocity.y * this.sys.game.loop.delta) / 1000;

    // set an area for weapons and enemies to exist any item outside this box gets deleted

    this.gameState.playArea.setPosition(
      this.cameras.main.worldView.x - playAreaOffset,
      this.cameras.main.worldView.y - playAreaOffset
    );
    // Enemies
    // enemy controls

    enemies.children.each((enemy) => {
      if (
        Phaser.Geom.Rectangle.Contains(
          this.gameState.playArea,
          enemy.x,
          enemy.y
        )
      ) {
        if (enemy.state === "ok") {
          this.physics.moveToObject(enemy, gameState.player, enemy.data.speed);
        }
      } else {
        enemy.destroy();
      }
    });
    weapons.children.each((weapon) => {
      if (
        !Phaser.Geom.Rectangle.Contains(
          this.gameState.playArea,
          weapon.x,
          weapon.y
        )
      ) {
        weapon.destroy();
      }
    });

    const player = gameState.player;
    // handle level up
    if (player.xp >= player.nextLevel) {
      this.physics.pause(); // Pause the physics
      this.scene.pause(); // Pause the current scene
      this.scene.launch("LevelUpScene", { level: "GameScene" }); // Start the level up scene
      this.paused = true;
      player.level++;
      const hpRate = player.hitpoints / player.maxHitpoints;
      player.maxHitpoints = 100 + player.stats.maxHitpointsBonus * 0.01;
      player.hitpoints = hpRate * player.maxHitpoints;

      player.xp -= player.nextLevel;
      player.nextLevel = Math.ceil(player.nextLevel * 1.2);
    }
  }
}
