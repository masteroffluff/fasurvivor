class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }
  preload() {
    this.load.svg(
      "logo",
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Codecademy.svg"
    );
    this.load.svg("survivors", "./imgs/survivors.svg");
  }

  startGame() {
	this.scene.stop();
	this.scene.start("GameScene");
  }
  create() {
    gameState.score = 0;
    //this.cameras.main.setBounds(0, 0, gameState.width, gameState.height);
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
    // Access game config bounds
    const gameConfig = this.game.config;
    const gameWidth = gameConfig.width;
    const gameHeight = gameConfig.height;
    graphics.fillRect(0, 0, gameWidth, gameHeight);
    this.add.image(200, 100, "logo").setScale(1.2);
    //const survivorImage2 = this.add.image(350, 250, 'survivors').setScale(0.3).setTint(0x111).setAlpha(0);

    const survivorImage = this.add
      .image(350, 250, "survivors")
      .setVisible(false);

    this.tweens.add({
      targets: survivorImage,
      paused: false,
      scaleX: {
        getStart: () => 2.5,
        getEnd: () => 0.3,
      },
      scaleY: {
        getStart: () => 2.5,
        getEnd: () => 0.3,
      },
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      },
      yoyo: false,
      duration: 1000,
    //   onUpdate: (tween) => {
    //     if (tween.progress > 0.9) {
    //       //survivorImage2.setAlpha(Math.cos(Math.PI+(((tween.progress-0.9)*10)*Math.PI)))
    //     }
    //   },
      onComplete:  ()=> {
        //survivorImage	2.destroy()
		this.startButton = this.button(
			config.width / 2,
			300,
			300,
			50,
			"Start Game",
			this.startGame
		  )
	  
		this.highScorebutton = this.button(
			config.width / 2,
			370,
			300,
			50,
			"High Scores",
			() => {
				console.log("click")
			if(this.loginbutton){
				this.loginbutton.hide()
			}
			  this.scene.pause();
			  this.scene.launch("HighScoreScene", { level: this.scene.key });
			}
		  )
      },
      onStart: () => {
        survivorImage.setVisible(true);
      },
    });
	
    //const text = this.add.text(150, 250, 'Click to start!', { fill: '#000', fontSize: '20px' })
    //text.setLineSpacing(5)

    //this.input.on('pointerdown', startGame, this)
    const spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    const enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    spaceBar.on("down", this.startGame, this);
    enter.on("down", this.startGame, this);

    const doLoginButton = () => {
      console.log("doing login")
      if (this.loginButton) {
        this.loginButton.destroy();
      }
      if (this.logoutButton) {
        this.logoutButton.destroy();
      }
      if (login_name == "") {
        this.loginButton = this.button(
          40,
          config.height - 20,
          60,
          25,
          "Log In",
          () => {
            this.loginButton.hide()
            console.log("button login");
            this.scene.pause();
            this.scene.launch("LoginScene", { level: this.scene.key });
          },
          { ...textStyle, fontSize: "16px" }
        );
      } else {
        this.loginButton = this.add
          .text(10, config.height - 20, `Logged in as ${login_name}`, {
            ...textStyle,
            fontSize: "16px",
          })
          .setDepth(101)
          .setOrigin(0, 0);
        ///
        this.logoutButton = this.button(
          config.width - 50,
          config.height - 20,
          70,
          25,
          "Log Out",
          () => {
            score_logout().then(()=>{doLoginButton()})
          },
          { ...textStyle, fontSize: "16px" }
        );
        
      }
    }
    doLoginButton();
    this.game.events.on("loginChange",()=>{
      //console.log('detected')
      doLoginButton()
    })
    this.events.on('shutdown', () => {
      this.game.events.off('loginChange');
    });

    //this.events.on("resume",doLoginButton)


  }
}
