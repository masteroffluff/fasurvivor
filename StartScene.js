class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	}

	create() {
		gameState.score = 0
		const graphics = this.add.graphics();
		graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
		graphics.fillRect(0, 0, gameState.height, gameState.width);
		this.add.text( 150, 250, 'Click to start!', {fill: '#000', fontSize: '20px'})
		this.input.on('pointerdown', () => {
			this.scene.stop('StartScene');
			this.scene.start('Level');
		})
	}
}