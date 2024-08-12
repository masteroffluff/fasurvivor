class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	};
	preload ()
	{
			this.load.svg('logo', 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Codecademy.svg');
			this.load.svg('survivors', './imgs/survivors.svg');
	}
	
	create() {
		gameState.score = 0
		//this.cameras.main.setBounds(0, 0, gameState.width, gameState.height);
		const graphics = this.add.graphics();
		graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
		// Access game config bounds
		const gameConfig = this.game.config;
		const gameWidth = gameConfig.width;
		const gameHeight = gameConfig.height;
		graphics.fillRect(0, 0, gameWidth, gameHeight);
		this.add.image(200, 100, 'logo').setScale(1.2);
		//const survivorImage2 = this.add.image(350, 250, 'survivors').setScale(0.3).setTint(0x111).setAlpha(0);
		
		const survivorImage = this.add.image(350, 250, 'survivors');
		
		this.tweens.add({
			targets: survivorImage,
			paused: false,
			scaleX: {
				getStart: () => 2.5,
				getEnd: () => 0.3
			},
			scaleY: {
				getStart: () => 2.5,
				getEnd: () => 0.3
			},
			alpha: {
				getStart: () => 0,
				getEnd: () => 1
			},
			yoyo: false,
			duration: 1000,
			onUpdate:(tween)=>{
				if(tween.progress>0.9){
				//survivorImage2.setAlpha(Math.cos(Math.PI+(((tween.progress-0.9)*10)*Math.PI)))
			}
			},
			onComplete: function() {
				//survivorImage2.destroy()
			}
		})
		this.add.text(150, 250, 'Click to start!', { fill: '#000', fontSize: '20px' })
		function startGame(){
			this.scene.stop('StartScene');
			this.scene.start('GameScene');
		}
		this.input.on('pointerdown', startGame, this)
		const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		const enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
		spaceBar.on('down', startGame, this)
		enter.on('down', startGame, this)

	}
}