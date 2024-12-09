
const gameState = {
	score: 0,
	money: 0,
	width: 2000,
  	height: 2000,
	highScore:100,
	debug:false
};
let weaponsData, bonusesData

// prevent addressbar on mobile
window.addEventListener("load",function() {
	// Set a timeout...
	setTimeout(function(){
		// Hide the address bar!
		window.scrollTo(0, 1);
	}, 0);
});


const config = {
	type: Phaser.AUTO,
	width: 500,
	height: 600,
	backgroundColor: "aaaaaa",
	physics: {
		default: 'arcade',
		arcade: {
			enableBody: true,
			debug: gameState.debug,
		}
	},
	scale: {
		// Fit to window
		mode: Phaser.Scale.FIT,
		// Center vertically and horizontally
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [StartScene, GameScene, PauseScene, HudScene, YouDiedScene, LevelUpScene, PickUpItemScene, LoginScene]
};

game = new Phaser.Game(config);

