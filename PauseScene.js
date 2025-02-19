class PauseScene extends Phaser.Scene {
	constructor() {
			super({ key: 'PauseScene' });
	}

	create(data) {
		const graphics = this.add.graphics();
		graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
		graphics.fillRect(config.width / 2-150, 250, 300, 50);

		const textStyle = { 
				fill: '#000', 
				fontSize: '20px', 
				wordWrap: { width: 280, useAdvancedWrap: true }, 
				align: 'center' 
		};
		

		const pauseText = this.add.text(
			config.width / 2-120, 
				250, 
				'Paused:\nPress "P" to unpause.', 
				textStyle
		);


		this.input.keyboard.on('keydown-P', () => {
				this.scene.resume(data.level);  // Resume the Level scene
				this.scene.stop();  // Stop the PauseScene
		});
		const doLoginButton = () => {
			console.log("doing login")
			if (this.loginButton) {
			  this.loginButton.destroy();
			}
			if (login_name == "") {
			  this.loginButton = this.button(
			    config.width/2,
			    400,
			    70,
			    25,
				"Log In",
				() => {
				  //this.loginButton.hide()
				  console.log("button login");
				  this.scene.pause();
				  this.scene.launch("LoginScene", { level: this.scene.key });
				},
				{ ...textStyle, fontSize: "16px" }
			  );
			} else {
			  this.loginButton = this.button(
			    config.width/2,
			    400,
			    70,
			    25,
			    "Log Out",
			    () => {
			      doLogout().then(()=>{
					doLoginButton()
					this.game.events.emit('loginChange')
				  })
			    },
			    { ...textStyle, fontSize: "16px" }
			  );
	  
			}
		  }
		  doLoginButton()
		  this.game.events.on("loginChange",()=>{
			
			doLoginButton()
		  })
		  this.events.on('shutdown', () => {
			this.game.events.off('loginChange');
		  });
	}
}