class IconThingy {
  static symbol = "■";
  static textStyle = {
    fontSize: "8px",
    fill: "#ff0",
    stroke: "#000",
    strokeThickness: 1,
    opacity: 1,
    wordWrap: { width: 40, useAdvancedWrap: true },
  };
  constructor(scene, thing, x, y) {
    console.log("creating");
    this.sprite = scene.add
      .sprite(x, y, thing.icon)
      .setScale(0.5)
      .setOrigin(0, 0.5);
    this.thing = thing;
    this.x = x;
    this.y = y;

    this._level = 1;
    this.text = scene.add.text(
      x,
      y + 16,
      IconThingy.symbol,
      IconThingy.textStyle
    );
  }

  update(x, y) {
    console.log("updating");
    this.x = x;
    this.y = y;
    this.sprite.setPosition(x, y);
    this.text.setPosition(x, y + 16);
    this.level = gameState.player.heldWeapons.get(this.thing) || 1;
    this.text.setText(IconThingy.symbol.repeat(this.level));
  }
}
class IconThingyBar {
  constructor(scene, xOffset, yOffset) {
    this.map = new Map();
    this.scene = scene;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
  }
  update() {
    const xmult = 32;
    const ymult = 40;
    let x = 0;
    let y = 0;
    const setUpRows = (itemMap) => {
      let rows = 1;
      for (const [item, _] of itemMap) {
        if (x >= 7) {
          x = 0;
          y++;
          rows++;
        }
        if (this.map.has(item)) {
          this.map
            .get(item)
            .update(x * xmult + this.xOffset, y * ymult + this.yOffset);
        } else {
          this.map.set(
            item,
            new IconThingy(
              this.scene,
              item,
              x * xmult + this.xOffset,
              y * ymult + this.yOffset
            )
          );
        }
        x++;
      }

      return rows;
    };
    const wRows = setUpRows(gameState.player.heldWeapons);
    x = 0;
    y++;
    const bRows = setUpRows(gameState.player.heldBonuses);
  }
}

class StatusBar {
  constructor(scene, x, y, title, fillColour, current, max) {
    this.x = x;
    this.y = y;
    this.title = scene.add.text(this.x, this.y, title, scene.defaultTextStyle);
    this.gameWidth = scene.game.config.width;
    this.bottomGraphics = scene.add.graphics();
    this.colour = Phaser.Display.Color.IntegerToColor(fillColour);
    this.bottomGraphics.lineStyle(2, this.colour.color, 1.0);
    this.bottomBar = this.bottomGraphics.strokeRect(
      this.x + this.title.width,
      this.y,
      this.gameWidth - this.title.width,
      16
    );
    this.topGraphics = scene.add.graphics();
    this.topGraphics.fillGradientStyle(
      this.colour.clone().lighten(50).color,
      this.colour.color,
      this.colour.color,
      this.colour.clone().darken(50).color,
      1
    );

    this.topBar = this.topGraphics.fillRect(
      this.x + this.title.width,
      this.y,
      (this.gameWidth - this.title.width) * (current / max),
      16
    );
  }
  update(current, max) {
    if (current > max) {
      current = max;
    }
    this.topGraphics.clear();
    this.topGraphics.fillGradientStyle(
      this.colour.clone().lighten(50).color,
      this.colour.color,
      this.colour.color,
      this.colour.clone().darken(50).color,
      1
    );

    this.topBar = this.topGraphics.fillRect(
      this.x + this.title.width,
      this.y,
      (this.gameWidth - this.title.width) * (current / max),
      16
    );
  }
}

class HudScene extends Phaser.Scene {
  constructor() {
    super({ key: "HudScene" });
  }
  button(x, y, w, h, text, onClick, ts = textStyle) {
    const button1 = this.add.rectangle(x, y, w, h).setOrigin(0.5, 0.5);
    button1.graphics = this.add.graphics();
    button1.graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
    
    const sb = button1.getBounds();
    button1.graphics.fillRect(sb.x, sb.y, sb.width, sb.height);
    button1.setStrokeStyle(1, 0x000000);

    button1.text = this.add
      .text(button1.x, button1.y, text, ts)
      .setDepth(101);
    button1.text.setOrigin(0.5, 0.5);
    button1.setInteractive();
    button1.on("pointerup", onClick, this);
    button1.on("pointerover", () => {
      button1.setFillStyle(0xffffff, 0.4);
    });
    button1.on("pointerout", () => {
      button1.setFillStyle();
    });
    return button1;
  }
  preload() {
    this.load.pack("bonusesPack", "./data/bonusesPack.json");
    this.load.pack("weaponsPack", "./data/weaponsPack.json");
    this.defaultTextStyle = {
      fontSize: "15px",
      fill: "#000000",
      stroke: "#f00",
      strokeThickness: 1,
      opacity: 0,
    };
  }

  create() {
    this.weaponOffSetX = 16;
    this.weaponOffSetY = 32;
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
    graphics.fillRect(
      0,
      this.game.config.height - 85,
      this.game.config.height,
      85
    );
    this.healthBar = new StatusBar(
      this,
      0,
      this.game.config.height - 80,
      "HP:",
      0xff0000,
      100,
      100
    );
    this.xpBar = new StatusBar(
      this,
      0,
      this.game.config.height - 60,
      "XP:",
      0x707ef9,
      0,
      100
    );

    this.iconThingyBar = new IconThingyBar(
      this,
      this.weaponOffSetX,
      this.weaponOffSetY
    );
    this.events.on(
      "UpdateHudItemTB",
      (w) => {
        this.iconThingyBar.update();
      },
      this
    );
    this.iconThingyBar.update();
    this.hiScoreText = this.add.text(
      this.game.config.width - 200,
      10,
      `Hi Score:${gameState.highScore}`,
      this.defaultTextStyle
    );
    this.scoreText = this.add.text(
      this.game.config.width - 200,
      30,
      `Killed:0`,
      this.defaultTextStyle
    );

    if (gameState.debug) {
      const textStyle = this.defaultTextStyle;
      this.scoreTextDemo = this.add.text(10, 0, `Killed:0`, textStyle);
      this.healthText = this.add.text(
        10,
        25,
        `Health:${gameState.player.hitpoints}`,
        this.defaultTextStyle
      );

      this.xpText = this.add.text(
        150,
        player.maxHitpoints`XP:${gameState.player.xp}/${gameState.player.nextLevel}`,
        this.defaultTextStyle
      );
      this.levelText = this.add.text(
        150,
        25,
        `Level:${gameState.player.level}`,
        this.defaultTextStyle
      );
      const weapons = Array.from(gameState.player.heldWeapons.keys());
      this.heldItemsText = this.add.text(
        150,
        50,
        `Weapons:${weapons.join(", ")}\nBonuses:`,
        {
          ...this.defaultTextStyle,
          wordWrap: { width: 240, useAdvancedWrap: true },
        }
      );
    }
    const doLoginButton = () => {
      console.log("doing login")
      if (this.loginButton) {
        this.loginButton.text.destroy()
        this.loginButton.graphics.destroy()
        this.loginButton.destroy();
      }
      if (login_name == "") {
        this.loginButton = this.button(
          40,
          config.height - 20,
          50,
          25,
          "Login",
          () => {
            console.log("button login");
            this.scene.pause("GameScene");
            this.scene.launch("LoginScene", { level: "GameScene" });
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
      }
    }
    doLoginButton();
    this.events.on("loginChange",doLoginButton)
  }



  update() {
    this.healthBar.update(
      gameState.player.hitpoints,
      gameState.player.maxHitpoints
    );
    this.xpBar.update(gameState.player.xp, gameState.player.nextLevel);
    this.scoreText.setText(`Killed:${gameState.score}`);
    if (gameState.debug) {
      this.scoreTextDemo.setText(`Killed:${gameState.score}`);
      this.healthText.setText(
        `Health:${Math.floor(gameState.player.hitpoints)}`
      );
      this.xpText.setText(
        `XP:${gameState.player.xp}/${gameState.player.nextLevel}`
      );
      this.levelText.setText(`Level:${gameState.player.level}`);
      const heldBonuses = Array.from(
        gameState.player.heldBonuses.entries()
      ).map(([e, l]) => e.name + ":" + l);

      const weapons = Array.from(gameState.player.heldWeapons.entries()).map(
        ([e, l]) => e.name + ":" + l
      );
      this.heldItemsText.setText(
        `Weapons:${weapons.join(", ")}\nBonuses:${heldBonuses.join(", ")}`
      );
    }
  }
}
