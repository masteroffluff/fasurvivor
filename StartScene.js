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
  button(x, y, w, h, text, onClick, ts = textStyle) {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
    const button1 = this.add.rectangle(x, y, w, h).setOrigin(0.5, 0.5);
    const sb = button1.getBounds();
    graphics.fillRect(sb.x, sb.y, sb.width, sb.height);
    button1.setStrokeStyle(1, 0x000000);

    const buttonText = this.add
	.text(button1.x, button1.y, text, ts)
	.setDepth(101)
	.setOrigin(0.5, 0.5);
    button1.setInteractive();
    button1.on("pointerup", onClick, this);
    button1.on("pointerover", () => {
      button1.setFillStyle(0xffffff, 0.4);
    });
    button1.on("pointerdown", () => {
      button1.setFillStyle(0x000000, 0.4);
    });
    button1.on("pointerout", () => {
      button1.setFillStyle();
    });
	button1.on('destroy',()=>{
		buttonText.destroy()
		graphics.destroy()
	})
	button1.hide = ()=>{
		graphics.setVisible(false)
		buttonText.setVisible(false)
		button1.setVisible(false)
	}
	button1.show = ()=>{
		graphics.setVisible(true)
		buttonText.setVisible(true)
		button1.setVisible(true)
	}	
	return button1
  }
  startGame() {
	this.scene.stop("StartScene");
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
	this.events.on('resume',()=>{
		if(this.loginbutton){
			this.loginbutton.show()
		}
	})
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



    if (login_name == "") {
      this.loginbutton = this.button(
        40,
        config.height - 20,
        50,
        25,
        "Login",
        () => {
          this.scene.pause();
          this.scene.launch("LoginScene", { level: this.scene.key });
        },
        { ...textStyle, fontSize: "16px" }
      );
    } else {
      this.add
        .text(10, config.height - 20, `Logged in as ${login_name}`, {
          ...textStyle,
          fontSize: "16px",
        })
        .setDepth(101)
        .setOrigin(0, 0);
    }



  }
}
