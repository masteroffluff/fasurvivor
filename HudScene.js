class HudScene extends Phaser.Scene {
	constructor() {
		super({ key: 'HudScene' })
	}

	create() {
		this.scoreText = this.add.text( 10, 0, `Killed:0`, {
      fontSize: "15px",
      fill: "#000000",
			opacity:0,
    });
		this.healthText = this.add.text( 10, 25, `Health:${gameState.player.hitpoints}`, {
      fontSize: "15px",
      fill: "#000",
			opacity:0,
    });
		this.hiScoreText = this.add.text( 10, 50, `Hi Score:${gameState.highScore}`, {
      fontSize: "15px",
      fill: "#000",
			opacity:0,
    });
		this.scoreText.setStroke('#ff0000', 2);
		this.healthText.setStroke('#ff0000', 2);
		this.hiScoreText.setStroke('#ff0000', 2);
	}
	update(){
		this.scoreText.setText(`Killed:${gameState.score}`);
		this.healthText.setText(`Health:${gameState.player.hitpoints}`);
	}
}