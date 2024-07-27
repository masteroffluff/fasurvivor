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

		const pauseText = this.add.text(
				130, 
				250, 
				'Lol You Died', 
				textStyle
		);

		// Adding debug outline to see the bounding box of the text
		//pauseText.setStroke('#ff0000', 2);

		this.input.on('pointerdown', () => {
				this.scene.stop('Level');  // Stop the Level scene
				this.scene.stop('HudScene'); // the hud scene
				this.scene.start('StartScene') // return to the front page
				this.scene.stop();  // and this scene
				
		});
			
	}
}