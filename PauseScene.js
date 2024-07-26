class PauseScene extends Phaser.Scene {
	constructor() {
			super({ key: 'PauseScene' });
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

		const pauseText = this.add.text(
				130, 
				250, 
				'Paused:\nPress "P" to unpause.', 
				textStyle
		);

		// Adding debug outline to see the bounding box of the text
		//pauseText.setStroke('#ff0000', 2);

		this.input.keyboard.on('keydown-P', () => {
				this.scene.resume(data.level);  // Resume the Level scene
				this.scene.stop();  // Stop the PauseScene
		});
			
	}
}