class YouDiedScene extends Phaser.Scene {
  constructor() {
    super({ key: "YouDiedScene" });
  }
  doHighScore(highScore) {
    const graphics = this.add.graphics();
    const maskGraphics = this.add.graphics();
    const y = 250,
      w = 400,
      h = 200,
      x = config.width / 2 - w / 2;
    graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
    graphics.fillRect(x, y, w, h);
    graphics.lineStyle(1, 0);
    graphics.strokeRect(x, y, w, h);
    graphics.moveTo(x, y + 40);
    graphics.lineTo(x + w, y + 40);
    graphics.closePath();
    graphics.strokePath();
    const catcher = this.add
      .rectangle(x, y - 30, w, 10)

      .setOrigin(0);
    this.physics.add.existing(catcher, false);
    catcher.body.setImmovable();
    catcher.name = "catcher";

	maskGraphics.fillStyle(0,0)
    maskGraphics.fillRect(x, y+40, w, h-40);
    const mask = new Phaser.Display.Masks.GeometryMask(this, maskGraphics);
    const highScores = this.physics.add.group();

    this.lastYPos = y + h;
    this.physics.add.overlap(catcher, highScores, (_, highScore) => {
      highScore.y = this.lastYPos;
    });
    let i = 1;
	this.add
	.text(x + w / 2, y + 20, "High Scores", {
	  ...textStyle,
	  fontSize: "30px",
	})
	.setOrigin(0.5);
    highScore.forEach((hs) => {
      console.log(hs);
      const text = this.add
        .text(
          x + 10,
          this.lastYPos,
          `${i}. ${hs.Name}........${hs.Score}\n`,
          textStyle
        )
        .setOrigin(0)
        .setMask(mask);

      if (hs.Name === login_name) {
        text.setStroke("#ff0000", 2, 0.5);
      }
      this.physics.add.existing(text, false);
      highScores.add(text);
      text.body.setVelocityY(-30);
      this.lastYPos += 25;
      i++;
      textStyle.name = hs.Name;
    });
  }

  create(data) {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xf00, 0.5);
    graphics.fillRect(0, 0, gameState.height, gameState.width); // checked

    // const textStyle = {
    // 		fill: '#aaa',
    // 		fontSize: '20px',
    // 		wordWrap: { width: 280, useAdvancedWrap: true },
    // 		align: 'center'
    // };
    //const highScoreText = null
    let message = "LOL You Died!\n";
    if (gameState.score > gameState.highScore) {
      message += "but you got the high score!";
      gameState.highScore = gameState.score;
      if (login_name == "") {
        message +=
          "\nWhy not log in to register your score \non the high score table?";
        this.button(config.width / 2, 350, 200, 50, "Login", () => {
          this.scene.pause();
          this.scene.launch("LoginScene", { level: this.scene.key });
          this.events.on("resume", () => {
            
          });
        });
      } else {
        const pleaseWait = this.add.text(
          config.width / 2,
          350,
          "Please wait",
          textStyle
        );
        score_submit(gameState.score).then((highScore) => {
          pleaseWait.destroy();
          this.doHighScore(highScore);
        });
      }
    } else {
      message += `lol lol you died.\n (You need to get over ${gameState.highScore} \n to qualify for the high score.)`;
      get_highscore().then((highScore) => {
        this.doHighScore(highScore);
      });
    }
    const messageText = this.add
      .text(config.width / 2, 80, `${message}`, textStyle)
      .setOrigin(0.5, 0);
    const mtBounds = messageText.getBounds();
    graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);

    graphics.fillRect(
      mtBounds.x - 20,
      mtBounds.y - 20,
      mtBounds.width + 40,
      mtBounds.height + 40
    ); // checked
    // Adding debug outline to see the bounding box of the text
    messageText.setStroke("#aaa", 1);

    this.button(config.width / 2, 500, 200, 50, "Exit", () => {
      this.scene.stop("GameScene"); // Stop the Level scene
      this.scene.stop("HudScene"); // the hud scene
      this.scene.start("StartScene"); // return to the front page
      this.scene.stop(); // and this scene
    });

    // this.input.on('pointerdown', () => {
    // 		this.scene.stop('GameScene');  // Stop the Level scene
    // 		this.scene.stop('HudScene'); // the hud scene
    // 		this.scene.start('StartScene') // return to the front page
    // 		this.scene.stop();  // and this scene

    // });
  }
}
