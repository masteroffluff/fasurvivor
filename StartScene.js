class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }
  preload() {
    // moved to boot scene
  }

  startGame() {
    console.log("this.scene:", this.scene);
    console.log("starting game scene");
    this.scene.start("GameScene");
    console.log("stopping start scene");
    this.scene.stop("StartScene");
  }


  kofiTab() {
    window.open("https://ko-fi.com/C0C51B5HEB", "_blank");
  }
  codecademyTab() {
    window.open("https://www.codecademy.com/learn/learn-phaser", "_blank");
  }
  create() {
    gameState.score = 0;
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
    // Access game config bounds
    const gameConfig = this.game.config;
    const gameWidth = gameConfig.width;
    const gameHeight = gameConfig.height;
    graphics.fillRect(0, 0, gameWidth, gameHeight);
    let logoScale = 1.2;
    let survivorsScale = 1;
    let survivorsOffset = 250;
    if (gameWidth < 400) {
      logoScale = 0.9;
      survivorsScale = 0.75;
      survivorsOffset = 200;
    }
    this.add.image(gameWidth / 2 - 50, 100, "logo").setScale(logoScale);

    const survivorImage = this.add
      .image(gameWidth / 2 + 100, survivorsOffset, "survivors")
      .setVisible(false);

    this.tweens.add({
      targets: survivorImage,
      paused: false,
      scaleX: {
        getStart: () => 2.5 * survivorsScale,
        getEnd: () => 0.3 * survivorsScale,
      },
      scaleY: {
        getStart: () => 2.5 * survivorsScale,
        getEnd: () => 0.3 * survivorsScale,
      },
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      },
      yoyo: false,
      duration: 1000,

      onComplete: () => {
        this.startButton = this.button(
          config.width / 2,
          300,
          300,
          50,
          "Start Game",
          this.startGame
        );

        this.highScorebutton = this.button(
          config.width / 2,
          370,
          300,
          50,
          "High Scores",
          () => {
            console.log("click");
            if (this.loginbutton) {
              this.loginbutton.hide();
            }
            this.scene.pause();
            this.scene.launch("HighScoreScene", { level: this.scene.key });
          }
        );
        this.kofiButton = this.button(
          config.width / 2,
          440,
          300,
          50,
          "Support me on Ko-Fi",
          this.kofiTab
        );
        this.codecademyButton = this.button(
          config.width / 2,
          510,
          300,
          50,
          "Learn Phaser.js",
          this.codecademyTab
        );
        this.add.text(
          config.width / 2,
          740,
          `Codecademy Logo, Codey and the bug sprites are all copyright and trademark Codecademy and used without permission.\nAll other code and graphics by Chris Chapman aka MasterOfFluff`,
          {
            ...this.defaultTextStyle,
            fill: "#000",
            fontSize: "12px",
            wordWrap: { width: 600, useAdvancedWrap: true },
          }
        )
        .setOrigin(0.5,0);
      },
      onStart: () => {
        survivorImage.setVisible(true);
      },
    });

    const spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    const enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    spaceBar.on("down", this.startGame, this);
    enter.on("down", this.startGame, this);

    const doLoginButton = () => {
      console.log("doing login");
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
            this.loginButton.hide();
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
            doLogout().then(() => {
              doLoginButton();
            });
          },
          { ...textStyle, fontSize: "16px" }
        );
      }
    };

    doLoginButton();
    this.game.events.on("loginChange", () => {
      //console.log('detected')
      doLoginButton();
    });
    this.events.on("shutdown", () => {
      console.log("Start Screen shutdown");
      this.game.events.off("loginChange");
    });

    //this.events.on("resume",doLoginButton)

    console.log({ list: this.list });
    document.getElementById("preloader").style.display = "none";
  }
}
