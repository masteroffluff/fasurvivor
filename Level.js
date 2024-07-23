
let enemies
let enemy
let playerSpeed = 100
let cursors;
let emitter;
let particles;
let enemyPool = ['enemy1']
let maxEnemies = 15
const enemyBoundsOffset = 50;




let weaponsData = {
  fireball: {
    type: 'projectile', // melee, area, special
    spriteName: 'fireball',
    damage: 1,
    velocity: 2,
    delay: 100,
    callback: 'shootFireball'
  }
}

weapons = ['fireball']
class Level extends Phaser.Scene {
  constructor() {
    super({ key: 'Level' })
  }

  preload() {
    this.load.image('enemy1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
    this.load.image('player', 'https://content.codecademy.com/courses/learn-phaser/codey.png')
    this.load.image('fireball', './imgs/fireball.png')
  }
  create() {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
    graphics.fillRect(0, 0, gameState.width, gameState.height)

    gameState.player = this.physics.add.sprite(100, 450, 'player')
    gameState.player.body.setSize(32, 32, true)//.setOffset(gameState.player.width/2,gameState.player.height/2)

    //this.cameras.main.setBounds(0, 0, 2000, 2000);
    this.cameras.main.startFollow(gameState.player);

    cursors = this.input.keyboard.createCursorKeys();
    enemies = this.physics.add.group();
    

    this.physics.add.collider(enemies.children.entries, enemies.children.entries);

    gameState.enemyBoundingBox = new Phaser.Geom.Rectangle(
      this.cameras.main.worldView.x - enemyBoundsOffset,
      this.cameras.main.worldView.y - enemyBoundsOffset,
      this.cameras.main.worldView.width + enemyBoundsOffset + enemyBoundsOffset,
      this.cameras.main.worldView.height + enemyBoundsOffset + enemyBoundsOffset
    )
    gameState.cameraView = new Phaser.Geom.Rectangle(
      this.cameras.main.worldView.x,
      this.cameras.main.worldView.y,
      this.cameras.main.worldView.width,
      this.cameras.main.worldView.height
    )
    function generateEnemy() {
      if (enemies.countActive() <= maxEnemies) {

        gameState.cameraView.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(gameState.enemyBoundingBox, gameState.cameraView)
        // const lrtb = Math.floor(Math.random() * 4)
        // let xCoord, yCoord
        // switch (lrtb){
        //   case 0: // left
        //   xCoord = 10;
        //   yCoord = Math.random() * 600;
        //   break;
        //   case 1: // right
        //   xCoord = 490;
        //   yCoord = Math.random() * 600; 
        //   break;
        //   case 2: // top
        //   xCoord = Math.random() * 500;
        //   yCoord = 10;
        //   break;
        //   case 3: // bottom
        //   xCoord = Math.random() * 500;
        //   yCoord = 590;
        //   break;
        //   default:
        //     // this should not happen
        // } 

        let randomEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)]
        //enemies.create(xCoord, yCoord, randomEnemy)
        enemies.create(spawnPoint.x, spawnPoint.y, randomEnemy)
      }
    }

    const enemyGenLoop = this.time.addEvent({
      callback: generateEnemy,
      delay: 100,
      callbackScope: this,
      loop: true,
    })
    //Weapons 
    weapons = this.physics.add.group();
    function fireWeapon(){
      const weapon1 = weapons.create(gameState.player.x, gameState.player.y, 'fireball').setScale(0.2)
      const targeted = enemies.children.getArray()[Math.floor(Math.random() * enemies.children.size)]
      weapon1.damage = 1
      
      this.physics.moveToObject(weapon1, targeted, 100);
    }

    const weaponLoop = (weaponName) => {
      //const weapon2 = weaponsData[weaponName]
      

      return this.time.addEvent({
        callback: fireWeapon,
        delay: 750,
        callbackScope: this,
        loop: true,

      })
    }
    weaponLoop(weapons[0])
  }
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

    // Enemies


    // enemy controls
    gameState.enemyBoundingBox.setPosition(this.cameras.main.worldView.x - enemyBoundsOffset, this.cameras.main.worldView.y - enemyBoundsOffset)
    enemies.children.each((enemy) => {
      if (Phaser.Geom.Rectangle.Contains(gameState.enemyBoundingBox, enemy.x, enemy.y)) {
        this.physics.moveToObject(enemy, gameState.player, 50);
      } else {
        enemy.destroy()
      }

    })




  }

}

