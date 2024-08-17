class LevelUpScene extends Phaser.Scene {
	constructor() {
			super({ key: 'LevelUpScene' });
	}
	
	create(data) {
		//let exitButtonText
		this.bonusesData = this.cache.json.get('bonusesData');
    this.weaponsData = this.cache.json.get('weaponsData');

		const graphics = this.add.graphics();
		graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
		graphics.fillRect(120, 100, 300, 50);

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

		const messageText = this.add.text(
				130, 
				100, 
				'Level Up!!\nPick One', 
				textStyle
		);
		const value = Phaser.Math.Between(2,3);
		const offset = 200;
		const margin = 50;
		let avaibleBonuses
		if(gameState.player.heldBonuses.length>=6){
			avaibleBonuses=this.bonusesData.filter((e)=> gameState.player.heldBonuses.includes(e.name))
		} else {
			avaibleBonuses=this.bonusesData
		}
		let avaibleWeapons	
		if(gameState.player.heldWeapons.length>=6){
			avaibleWeapons = Object.values(Object.values(this.weaponsData)).filter((e)=>gameState.player.heldWeapons.includes(e.name))

		} else {
			
			avaibleWeapons = Object.values(Object.values(this.weaponsData))
		}
		const selectableItems = [...avaibleBonuses,...avaibleWeapons]
		Phaser.Utils.Array.Shuffle(selectableItems);

		let selected = 0
		const buttons = [];

		for(let i = 0;i<=value;i++){
			graphics.fillRect(120, offset+margin*i, 300, 50);
			const button = this.add.rectangle(120, offset+margin*i, 300, 50).setOrigin(0,0);
			button.setDepth(100)
			//button.isFilled = true;
			//button.fillColor = 0xFFF;
			//button.setStrokeStyle(2,'#fff');
			button.isStroked = false
			this.add.sprite(120+5, offset+margin*i+margin/2, selectableItems[i].icon).setScale(0.5).setOrigin(0,0.5);
			
			//* title text
			this.add.text(
				130+16+20, 
				5+offset+margin*i, 
				`${selectableItems[i].name}`, 
				textStyle
			).setDepth(101);
			//* description text
			this.add.text(
				130+16+20, 
				20+5+offset+margin*i, 
				`${selectableItems[i].desc}`, 
				textStyle_small
			).setDepth(101);

			button.setInteractive();
			button.on('pointerup', function(b) {
				selected = (i);
				updateSelected.call(this)
				//this.isFilled = true;
				//this.fillColor = 0x00FF00;
				//console.log(this.x, this.y)
			});
			buttons.push(button) // asdded to array to control bounding box
		}


		graphics.fillRect(120, offset+margin*5, 300, 50);

		const exitButton = this.add.rectangle(120, offset+margin*5, 300, 50).setOrigin(0,0);
		//exitButton.setFillStyle(0x00FF00)
		//if (this.exitButtonText)  {delete(this.exitButtonText)}
		this.exitButtonText = this.add.text(
			130, 
			5+offset+margin*5, 
			`Click to select ${selectableItems[selected].name}`, 
			textStyle_exitButton
		).setDepth(101);

		exitButton.setInteractive();
		exitButton.on('pointerup', resumeGame, this);
		const updateSelected=()=>{
			buttons.forEach((button)=>{
				button.isStroked = false
			})
			buttons[selected].setStrokeStyle(2,0xFFFFFF);
			this.exitButtonText.setText(`Click to select ${selectableItems[selected].name}`)
		}
		updateSelected.call(this);
		this.cursors = this.input.keyboard.createCursorKeys();
		this.cursors.up.on('up', () => {
			selected--
			if (selected<0){
				selected= value
			}
			updateSelected.call(this);
	});

	this.cursors.down.on('down', () => {
			selected++
			if(selected>value){
				selected= 0
			}
			updateSelected.call(this);
	});
		// Adding debug outline to see the bounding box of the text
		messageText.setStroke('#ff0000', 2);
		function resumeGame(){
			const {name,type} = selectableItems[selected]
			//console.log(this)
			if(type==='weapon'){
				//console.log()
				if (!gameState.player.heldWeapons.includes(name)) {
					gameState.player.heldWeapons.push(name)
					this.scene.get(data.level).events.emit('weaponLoop', name)
				}
			}
			if(type==='bonus'){
				if (!gameState.player.heldBonuses.includes(name)) {
					gameState.player.heldBonuses.push(name)
					
				}
			}
			this.scene.resume(data.level);  // Resume the Level scene
			this.scene.stop();  // Stop the PauseScene
		}
		//this.input.on('pointerdown', resumeGame, this)


		const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		const enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
		spaceBar.on('down', resumeGame, this)
		enter.on('down', resumeGame, this)


	}
}