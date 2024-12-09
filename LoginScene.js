class LoginScene extends Phaser.Scene {
	constructor() {
			super({ key: 'LoginScene' });
	}

	create(data) {
		const rightOffset = config.width/2
		const topOffset = 120
		const graphics = this.add.graphics();
		graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
		graphics.fillRect(0, 0, 800, 600);
		
		let activeBox = 0
		

		const loginDetails = ["",""] // 0 username, 1= password

		const textStyle = { 
				fill: '#000', 
				fontSize: '20px', 
				wordWrap: { width: 280, useAdvancedWrap: true }, 
				align: 'center' 
		};

		this.add.text(rightOffset, 50, 'Login', {...textStyle,fontSize: '40px'}).setOrigin(0.5,0.5)

		const labels = [null,null]
		const textEntrys = [null, null]
		const textBackGrounds = [null,null]

        labels[0] =     this.add.text(rightOffset, topOffset+10, 'Enter your name:', textStyle).setOrigin(0.5,0.5)
        textEntrys[0] = this.add.text(rightOffset, topOffset+50, '', textStyle).setOrigin(0.5,0.5)

		
        labels[1] =     this.add.text(rightOffset, topOffset+80, 'Enter your password:', textStyle).setOrigin(0.5,0.5)
        textEntrys[1] = this.add.text(rightOffset, topOffset+120, '', textStyle).setOrigin(0.5,0.5)
		

		for (let t in textEntrys){
			const tFunction = ()=>{
				console.log(t);
				textBackGrounds.forEach(tb => tb.setFillStyle(0xaaaaaa));
				textBackGrounds[t].setFillStyle(0xcccccc);
				activeBox=t;
			}


			textBackGrounds[t] = this.add.rectangle(textEntrys[t].x, textEntrys[t].y, 200, 30);
			textBackGrounds[t].setFillStyle(0xaaaaaa);
			textBackGrounds[t].setStrokeStyle(1,0x000000);
			textBackGrounds[t].setDepth(1);
			textEntrys[t].setDepth(2);
			const lb = labels[t].getBounds()
			const rect = this.add.rectangle(rightOffset, lb.y, 250, 70).setOrigin(0.5,0);
			rect.setDepth(999);
			rect.setInteractive();
			rect.on("pointerup",tFunction);
			//rect.setStrokeStyle(2,0xff0000);

			
		}


		
        this.input.keyboard.on('keydown', event =>
        {
			console.log(event.key, activeBox, loginDetails[activeBox])
            if (event.keyCode === 8 && textEntrys[activeBox].text.length > 0)
            {
                loginDetails[activeBox] = textEntrys[activeBox].text.substr(0, textEntrys[activeBox].text.length - 1);

            }
            else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode <= 90))
            {

                loginDetails[activeBox] += event.key;
            }
			if(activeBox==0){
				textEntrys[0].text = loginDetails[0]
			} else {
				textEntrys[1].text = "*".repeat(loginDetails[activeBox].length)
			}
			 
        });

		const loginButton = this.add.rectangle(rightOffset, topOffset+180, 300, 50);

		loginButton.setStrokeStyle(1,0x000000)
		.setFillStyle(0xaaaaaa);

		this.loginButtonText = this.add.text(
			loginButton.x,
			loginButton.y,
			`Login`,
			textStyle
		).setDepth(101);
		this.loginButtonText.setOrigin(0.5,0.5)
		loginButton.setInteractive()

		loginButton.on('pointerup', ()=>{
			if(textEntrys[0].text.length > 0|| textEntrys[1].text.length > 0){
				console.log(textEntrys[0].text)
				return
			}
		})
	}
}