
const gameState = {
	score: 0,
	money: 0,
	width: 2000,
  height: 2000,
	highScore:100,
};
let weaponsData, bonusesData

const config = {
	type: Phaser.AUTO,
	width: 500,
	height: 600,
	backgroundColor: "aaaaaa",
	physics: {
		default: 'arcade',
		arcade: {
			enableBody: true,
			debug: true,
		}
	},
	scale: {
		// Fit to window
		mode: Phaser.Scale.FIT,
		// Center vertically and horizontally
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [StartScene, GameScene, PauseScene, HudScene, YouDiedScene, LevelUpScene, PickUpItemScene]
};

game = new Phaser.Game(config);

