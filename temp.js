// class GameScene extends Phaser.Scene {
//     constructor() {
//         super({ key: 'GameScene' });
//     }

//     // ***** PRELOAD FUNCTION *******
//     preload() {
//         this.load.image('enemy1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
//         this.load.image('player', 'https://content.codecademy.com/courses/learn-phaser/codey.png');
//         this.load.image('fireball', './imgs/fireball.png');
//         this.load.image('sword', './imgs/sword3.png');
//         this.load.image('gem1', './imgs/gem1.png');
//         this.load.image('heart', './imgs/heart.png');

//         // Load packs
//         this.load.pack('bonusesPack', './data/bonusesPack.json');
//         this.load.pack('weaponsPack', './data/weaponsTemp.json');
//     }

//     // ***** CREATE FUNCTION *******
//     create() {
//         // Log the cache contents

//         const sprite = this.add.sprite(400, 300, 'sword').setOrigin(0, 0.5);
//         const angle = -120
//         sprite.angle = angle;  // Set initial angle

//         console.log('Initial angle:', sprite.angle);

//         this.tweens.add({
//             targets: sprite,
//             angle:-360+sprite.angle,
//             duration: 1000,
//             yoyo: false,
//             repeat: false,
//             onUpdate: () => {
//                 console.log('Current angle:', sprite.angle);
//             }
//         });

//     }
// }

// const gameState = {
// 	score: 2,
// 	money: 0,
// 	width: 2000,
//   	height: 2000,
// 	highScore:1,
// 	debug:false
// };

// const textStyle = {
// 	fill: '#000',
// 	fontSize: '20px',
// 	wordWrap: { width: 280, useAdvancedWrap: true },
// 	align: 'center'
// };

var publicKey,
  sessionId,
  login_name = "fluffy";

// // Configuration for the Phaser game
// const config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     backgroundColor: "aaaaaa",
//     scene: [YouDiedScene],
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { y: 0 },
//             debug: false
//         }
//     }
// };
// const game = null;

score_login("fluffy", "fluffy1").then(() => {
  score_submit(100)
    .then((r) => {
      console.log(r);
    })
    .catch((e) => {
      console.log(e);
    });

  // console.log(sessionId)
  //     game = new Phaser.Game(config);
});
