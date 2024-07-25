const gameState = {
	score: 0,
	money: 0,
	width: 2000,
  height: 2000,
};

const config = {
	type: Phaser.AUTO,
	width: 500,
	height: 600,
	backgroundColor: "aaaaaa",
	physics: {
		default: 'arcade',
		arcade: {
			enableBody: true,
			//debug: true,
		}
	},
	scale: {
		// Fit to window
		mode: Phaser.Scale.FIT,
		// Center vertically and horizontally
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [StartScene, Level, PauseScene]
};

const game = new Phaser.Game(config);
