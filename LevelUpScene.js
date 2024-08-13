class LevelUpScene extends Phaser.Scene {
	constructor() {
			super({ key: 'LevelUpScene' });
	}
	
	create(data) {
		this.bonusesData = this.cache.json.get('bonusesData');
    this.weaponsData = this.cache.json.get('weaponsData');

		const graphics = this.add.graphics();
		graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
		graphics.fillRect(120, 100, 300, 50);

		const textStyle = { 
				fill: '#000', 
				fontSize: '20px', 
				wordWrap: { width: 280, useAdvancedWrap: true }, 
				align: 'center' 
		};
		const textStyle_small = { 
			fill: '#000', 
			fontSize: '10px', 
			wordWrap: { width: 240, useAdvancedWrap: true }, 
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
		if(gameState.player.heldBonuses>=6){
			avaibleBonuses=this.bonusesData.filter((e)=> gameState.player.heldBonuses.includes(e.name))
		} else {
			avaibleBonuses=this.bonusesData
		}
		let avaibleWeapons	
		if(gameState.player.heldWeapons>=6){
			avaibleWeapons = Object.values(Object.values(this.weaponsData)).filter((e)=>gameState.player.heldWeapons.includes(e.name))

		} else {
			
			avaibleWeapons = Object.values(Object.values(this.weaponsData))
		}
		const selectableItems = [...avaibleBonuses,...avaibleWeapons]
		Phaser.Utils.Array.Shuffle(selectableItems);

		let selected = 0
		const buttons = [];
		function updateSelected(){
			buttons.forEach((button)=>{
				button.isStroked = false
			})
			buttons[selected].setStrokeStyle(2,0xFFFFFF);
		}
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
				updateSelected()
				//this.isFilled = true;
				//this.fillColor = 0x00FF00;
				//console.log(this.x, this.y)
			});
			graphics.fillRect(120, offset+margin*5, 300, 50);
			const exitButton = this.add.rectangle(120, offset+margin*5, 300, 50).setOrigin(0,0);

			exitButton.on('pointerup', function(b) {
				resumeGame()
			});



			buttons.push(button)

		}
		updateSelected();
		// Adding debug outline to see the bounding box of the text
		messageText.setStroke('#ff0000', 2);

		function resumeGame(){
			const {name:value,type} = selectableItems[selected]
			console.log()
			if(type==='weapon'){
				console.log()
				if (!gameState.player.heldWeapons.includes(value)) {
					gameState.player.heldWeapons.push(value)
					this.scene.get(data.level).events.emit('weaponLoop', value)
				}
			}
			if(type==='bonus'){
				if (!gameState.player.heldBonuses.includes(value)) {
					gameState.player.heldBonuses.push(value)
					
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
		const kKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
		kKey.on('down', ()=>{
			console.log('holla...')
			
		})

	}
}