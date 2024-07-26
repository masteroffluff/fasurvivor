class HudScene extends Phaser.Scene {
	constructor() {
		super({ key: 'HudScene' })
	}

	create() {
		gameState.scoreText = this.add.text( 0, 0, `Killed:0`, {
      fontSize: "15px",
      fill: "#000000",
			opacity:0,
    });
		gameState.scoreText.setStroke('#ff0000', 2);
	}
	update(){
		gameState.scoreText.setText(`Killed:${gameState.score}`);
	}
}