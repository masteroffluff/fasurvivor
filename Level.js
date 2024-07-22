
let enemies;  
let playerSpeed = 100
let cursors;
let emitter;
let particles;


class Level extends Phaser.Scene {
	constructor() {
		super({ key: 'Level' })
	}
  
  preload(){
    this.load.image('enemy1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
    this.load.image('player','https://content.codecademy.com/courses/learn-phaser/codey.png')
  }
	create() {
    
    gameState.player = this.physics.add.sprite(100, 450, 'player')
    cursors = this.input.keyboard.createCursorKeys();
	}
  update() {
    // use dx and dy to control the player velocity initially zero as not moving
    let dX=0,dY=0
    if (cursors.left.isDown) {
      dX=-1; // we want to apply a negative x velocity to go left on the screen so dx = -1
      gameState.player.flipX = true
    } 
    if (cursors.right.isDown) {
      dX=1; // we want to apply a positive x velocity to go right on the screen so dx = 1
      gameState.player.flipX = false
    } 
    if (cursors.up.isDown) {
      dY=-1; // we want to apply a negative y velocity to go up on the screen so dy = -1
      
    } 
    if (cursors.down.isDown) {
      dY=1; // we want to apply a positive y velocity to go down on the screen sop dy = 1
      
    } 
    // we then multiply dx and dy by the velocityx and velovity y times the speed
    gameState.player.setVelocityX(dX*playerSpeed);
    gameState.player.setVelocityY(dY*playerSpeed);
    
  }
}