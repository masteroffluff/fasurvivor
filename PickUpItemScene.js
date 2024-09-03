class PickUpItemScene extends Phaser.Scene {
	constructor() {
		super({ key: 'PickUpItemScene' });
	}


	create(data) {
		function titleCase(str) {
			return str.toLowerCase().split(' ').map(function (word) {
				return (word.charAt(0).toUpperCase() + word.slice(1));
			}).join(' ');
		}
		const textStyle = {
			fill: '#000',
			fontSize: '20px',
			wordWrap: { width: 300, useAdvancedWrap: true },
			align: 'left'
		};
		const textStyle_small = {
			fill: '#000',
			fontSize: '10px',
			wordWrap: { width: 240, useAdvancedWrap: true },
			align: 'left'
		}
		const textStyle_exitButton = {
			fill: '#000',
			fontSize: '15px',
			wordWrap: { width: 300, useAdvancedWrap: true },
			align: 'left'
		}
		//let exitButtonText
		if (!data.value) {
			data = { type: 'weapon', value: 'sword' }
		}
		const { value, type } = data

		let ok = true
		this.input.keyboard.resetKeys()
		let cache
		if (type === 'bonus') {
			cache = this.cache.json.get('bonusesData');
		} else
			if (type === 'weapon') {
				cache = this.cache.json.get('weaponsData');
			}
		const { icon, desc } = cache[value]

		const graphics = this.add.graphics();
		graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
		graphics.fillRect(120, 100, 300, 250);
		const messageText = this.add.text(
			130,
			100,
			`${titleCase(data.value)} Found!!!`,
			textStyle
		);
		this.add.sprite(270, 200, icon).setOrigin(0.5, 0.5);
		const descText = this.add.text(
			130,
			300,
			desc,
			textStyle_small
		);

		const offset = 200;
		const margin = 50;
		graphics.fillRect(120, offset + margin * 4, 300, 50);

		function emitMessage() {
			if (ok) {
				ok = false

				console.log('firing event', type, value, data.level)

				if (type === 'weapon') {
					console.log("weapon event")
					this.scene.get(data.level).events.emit('getWeapon', value)
				}
				if (type === 'bonus') {
					this.scene.get(data.level).events.emit('getBonus', value)
				}

				resumeGame()
			}
		}


		const resumeGame = () => {
			this.scene.resume(data.level);  // Resume the Level scene
			this.scene.stop();  // Stop the PauseScene
		}


		const yesButton = this.add.rectangle(120, offset + margin * 4, 300, 50).setOrigin(0, 0);
		//exitButton.setFillStyle(0x00FF00)
		//if (this.exitButtonText)  {delete(this.exitButtonText)}
		this.yesButtonText = this.add.text(
			130,
			5 + offset + margin * 4,
			`Yes`,
			textStyle_exitButton
		).setDepth(101);

		yesButton.setInteractive();
		yesButton.on('pointerup', emitMessage, this);

		graphics.fillRect(120, offset + margin * 5, 300, 50);

		const noButton = this.add.rectangle(120, offset + margin * 5, 300, 50).setOrigin(0, 0);
		//exitButton.setFillStyle(0x00FF00)
		//if (this.exitButtonText)  {delete(this.exitButtonText)}
		this.noButtonText = this.add.text(
			130,
			5 + offset + margin * 5,
			`No`,
			textStyle_exitButton
		).setDepth(101);

		noButton.setInteractive();
		noButton.on('pointerup', resumeGame, this);
		const buttons = [yesButton, noButton]
		let selected = 1
		const updateSelected = () => {
			buttons.forEach((button) => {
				button.isStroked = false
			})
			buttons[selected].setStrokeStyle(2, 0xFFFFFF);

		}
		updateSelected.call(this);
		const keyCodes = [
			Phaser.Input.Keyboard.KeyCodes.UP,
			Phaser.Input.Keyboard.KeyCodes.DOWN
		]
		const exitCodes = [
			Phaser.Input.Keyboard.KeyCodes.SPACE,
			Phaser.Input.Keyboard.KeyCodes.ENTER
		]
		this.input.keyboard.on('keyup', (event) => {
			if (keyCodes.includes(event.keyCode)) {
				console.log(selected)
				selected++
				selected = selected % 2
				updateSelected.call(this);
			}
			if (exitCodes.includes(event.keyCode)){
				if (selected ===0){
					// yes
					emitMessage.call(this)
				} else {
					//no
					resumeGame.call(this)
				}
			}
		});

		

			messageText.setStroke('#ff0000', 2);

	}
}
