class YouDiedScene extends Phaser.Scene {
	constructor() {
			super({ key: 'YouDiedScene' });
	}

	create(data) {
		const graphics = this.add.graphics();
		graphics.fillStyle(0xf00, 0.5);
		graphics.fillRect(0, 0, gameState.height, gameState.width);

		const textStyle = { 
				fill: '#aaa', 
				fontSize: '20px', 
				wordWrap: { width: 280, useAdvancedWrap: true }, 
				align: 'center' 
		};
		let message ='';
		if(gameState.score>gameState.highScore){
			message = "but you got the high score!"
			gameState.highScore=gameState.score
		} else {
			message = "lol lol you died"
		}
		const messageText = this.add.text(
				130, 
				250, 
				`LOL You Died!\n${message}`, 
				textStyle
		);

		// Adding debug outline to see the bounding box of the text
		messageText.setStroke('#aaa', 1);

		this.input.on('pointerdown', () => {
				this.scene.stop('Level');  // Stop the Level scene
				this.scene.stop('HudScene'); // the hud scene
				this.scene.start('StartScene') // return to the front page
				this.scene.stop();  // and this scene
				
		});
			
	}
}