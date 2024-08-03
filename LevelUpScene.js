class LevelUpScene extends Phaser.Scene {
	constructor() {
			super({ key: 'LevelUpScene' });
	}

	create(data) {
		const graphics = this.add.graphics();
		graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
		graphics.fillRect(120, 250, 300, 50);

		const textStyle = { 
				fill: '#000', 
				fontSize: '20px', 
				wordWrap: { width: 280, useAdvancedWrap: true }, 
				align: 'center' 
		};

		const messageText = this.add.text(
				130, 
				250, 
				'Level Up!!', 
				textStyle
		);

		// Adding debug outline to see the bounding box of the text
		messageText.setStroke('#ff0000', 2);

		this.input.on('pointerdown', () => {
				this.scene.resume(data.level);  // Resume the Level scene
				this.scene.stop();  // Stop the PauseScene
		});
			
	}
}