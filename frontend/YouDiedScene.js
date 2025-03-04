class YouDiedScene extends Phaser.Scene {
  constructor() {
    super({ key: "YouDiedScene" });
  }
  init() {
    this.add.dom || console.error("DOM Plugin is not available! Make sure it's enabled in the config.");
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

    maskGraphics.fillStyle(0, 0);
    maskGraphics.fillRect(x, y + 40, w, h - 40);
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
        text.setStroke("#ff0000", 2);
      }
      this.physics.add.existing(text, false);
      highScores.add(text);
      text.body.setVelocityY(-30);
      this.lastYPos += 25;
      i++;
      //textStyle.name = hs.Name;
    });
  }
  youDiedMessage(){
    let message = "LOL You Died!\n";
    if (gameState.score > gameState.highScore) {
      message += "but you got the high score!";
    }

  }

  create(data) {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xf00, 0.5);
    graphics.fillRect(0, 0, gameState.height, gameState.width); // checked
    let message = "LOL You Died!\n";
    
    if (gameState.score > gameState.highScore) {
      message += "but you got the high score!";
      gameState.highScore = gameState.score;
      if (login_name == "") {
        message +=
          "\nWhy not log in to submit your score \non the high score table?";
        const loginButton = this.button(
          config.width / 2,
          350,
          200,
          50,
          "Login",
          () => {
            this.scene.pause();
            this.scene.launch("LoginScene", { level: this.scene.key });
            this.events.on("resume", () => {
              let message = "LOL You Died!\nbut you got the high score!";
              if (login_name !== "") {
                score_submit(gameState.score).then((highScore) => {
                  loginButton.destroy();
                  message += "\nScore submitted!";
                  messageText.setText(message);
                  this.doHighScore(highScore);
                });
              } else {
                get_highscore().then((highScore) => {
                  this.doHighScore(highScore);
                });
              }
            });
          }
        );
      } else {
        const pleaseWait = this.add
          .text(config.width / 2, 350, "Please wait", textStyle)
          .setOrigin(0.5, 0.5)
          .setDepth(0);
        const pleaseWaitbox = this.add.graphics().setDepth(-1);
        const pwBounds = pleaseWait.getBounds();
        pleaseWaitbox.fillGradientStyle(
          0x00ffff,
          0xffff00,
          0xff00ff,
          0x00ff00,
          1
        );
        pleaseWaitbox.fillRect(
          pwBounds.x,
          pwBounds.y,
          pwBounds.width,
          pwBounds.height
        );

        score_submit(gameState.score).then((highScore) => {
          pleaseWait.destroy();
          pleaseWaitbox.destroy();
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
    //graphics.fillRect(40, 60, 420, 500);
    const y = mtBounds.y - 20,
    w = 420,
    h = 500,
    x = config.width / 2 - w / 2 + 10;
    graphics.fillRect(
      x-10,
      mtBounds.y - 20,
      w,
      h
    ); // checked

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
