const gameState = {
	score: 0
};

const config = {
	type: Phaser.AUTO,
	width: 450,
	height: 500,
	backgroundColor: "b9eaff",
	physics: {
		default: 'arcade',
		arcade: {
			enableBody: true,
		}
	},
	scene: [StartScene, Level]
};

const game = new Phaser.Game(config);
