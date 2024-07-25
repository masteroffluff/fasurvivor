class PauseScene extends Phaser.Scene {
	constructor() {
			super({ key: 'PauseScene' });
	}

	create(data) {
		const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
    graphics.fillRect(120, 250, 300, 50)
		this.add.text( 150, 250, 'Paused:\nPress "P" to unpause.', {fill: '#000', fontSize: '20px'})
			this.input.keyboard.on('keydown-P', () => {
					this.scene.resume(data.level);  // Resume the Level scene
					this.scene.stop();  // Stop the PauseScene
			});
	}
}