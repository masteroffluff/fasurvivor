
let enemies
let weapons
let enemy
let playerSpeed = 100
let cursors;
let emitter;
let particles;
let enemyPool = ['enemy1']
let maxEnemies = 15
const playAreaOffset = 50;




const weaponsData = {
  fireball: {
    name: 'fireball',
    type: 'projectile', // melee, area, special
    spriteName: 'fireball',
    damage: 1,
    velocity: 100,
    delay: 750,
    pen: 1,
  },
  sword: {
    name: 'sword',
    type: 'melee',
    spriteName: 'sword',
    damage: 1,
    velocity: 2,
    delay: 3000,
    pen: Infinity,
  }
}
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
        sword.pen = pen
        
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

const heldWeapons = ['fireball', 'sword'];



class Level extends Phaser.Scene {
  constructor() {
    super({ key: 'Level' })
  }


//// ***** PRELOAD FUNCTION *******
  preload() {
    this.load.image('enemy1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
    this.load.image('player', 'https://content.codecademy.com/courses/learn-phaser/codey.png')
    this.load.image('fireball', './imgs/fireball.png')
    this.load.image('sword', './imgs/sword3.png')

  }
  //// ***** CREATE FUNCTION *******
  create() {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x00ffff, 0xff0000, 0xff00ff, 0x00ff00, 1);
    graphics.fillRect(-50, -50, gameState.width, gameState.height)

    gameState.player = this.physics.add.sprite(100, 450, 'player')
    gameState.player.body.setSize(32, 32, true)//.setOffset(gameState.player.width/2,gameState.player.height/2)

    //this.cameras.main.setBounds(0, 0, 2000, 2000);
    this.cameras.main.startFollow(gameState.player);

    cursors = this.input.keyboard.createCursorKeys();
    enemies = this.physics.add.group();


    this.physics.add.collider(enemies.children.entries, enemies.children.entries);

    gameState.playArea = new Phaser.Geom.Rectangle(
      this.cameras.main.worldView.x - playAreaOffset,
      this.cameras.main.worldView.y - playAreaOffset,
      this.cameras.main.worldView.width + playAreaOffset + playAreaOffset,
      this.cameras.main.worldView.height + playAreaOffset + playAreaOffset
    );
    gameState.cameraView = new Phaser.Geom.Rectangle(
      this.cameras.main.worldView.x,
      this.cameras.main.worldView.y,
      this.cameras.main.worldView.width,
      this.cameras.main.worldView.height
    );

    function generateEnemy() {
      if (enemies.countActive() <= maxEnemies) {

        gameState.cameraView.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(gameState.playArea, gameState.cameraView)

        let randomEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)]
        //enemies.create(xCoord, yCoord, randomEnemy)
        const enemy = enemies.create(spawnPoint.x, spawnPoint.y, randomEnemy)
        enemy.life = 1;
        enemy.deadTween = this.tweens.add({
          targets: enemy,
          paused: true,
          scaleX: 0,
          scaleY: 0,
          yoyo: false,
          duration: 150,
          onComplete: () => {
            enemy.destroy()
          }
        })
      }
    };


    //Weapons 
    weapons = this.physics.add.group();
    this.physics.add.overlap(weapons, enemies, (w, e) => {
      //if(!e.dead){
      w.pen--
      e.life--
      if (w.pen <= 0) {
        w.destroy();
      }

      if (e.life <= 0) {
        //e.disableBody(e.body) 
        e.body.destroy()
        e.dead = true;
        e.deadTween.restart()
        gameState.score++
        
      }
      //}
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
    heldWeapons.forEach((w) => { // start weapon loops for weapons held at the start
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
        this.scene.launch('PauseScene', { level: 'Level' });  // Start the PauseScene
        this.paused = true;
      }
    });

    // Correctly bind the 'resume' event on this scene
    this.events.on('resume', () => {
      if (this.paused) {
        this.physics.resume();  // Resume the physics
        this.paused = false;
      }
    }, this);  // Bind the context
  }

  //// ***** UPDATE FUNCTION *******
  update() {

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

    gameState.player.setVelocityX(dX * playerSpeed);
    gameState.player.setVelocityY(dY * playerSpeed);


    // set an area for weapons and enemies to exist any item outside this box gets deleted
    gameState.playArea.setPosition(this.cameras.main.worldView.x - playAreaOffset, this.cameras.main.worldView.y - playAreaOffset)
    // Enemies
    // enemy controls

    enemies.children.each((enemy) => {
      if (Phaser.Geom.Rectangle.Contains(gameState.playArea, enemy.x, enemy.y)) {
        if (enemy.life > 0) {
          this.physics.moveToObject(enemy, gameState.player, 50);

        } else {
          //enemy.deadTween.restart()
        }
      } else {
        enemy.destroy()
      }

    })
    weapons.children.each((weapon) => {
      if (!Phaser.Geom.Rectangle.Contains(gameState.playArea, weapon.x, weapon.y)) {
        weapon.destroy()
      }
    })



  }

}

