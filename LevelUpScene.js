class LevelUpScene extends Phaser.Scene {
  constructor() {
    super({ key: "LevelUpScene" });
  }

  create(data) {
    let ok = true;
    this.input.keyboard.resetKeys();
    this.bonusesData = this.cache.json.get("bonusesData");
    this.weaponsData = this.cache.json.get("weaponsData");

    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
    graphics.fillRect(this.game.config.width/2-150, 100, 300, 50);

    const textStyle = {
      fill: "#000",
      fontSize: "20px",
      wordWrap: { width: 300, useAdvancedWrap: true },
      align: "left",
    };
    const textStyle_small = {
      ...textStyle,
      fontSize: "10px",
      wordWrap: { width: 260, useAdvancedWrap: true },
    };
    const textStyle_exitButton = {
      ...textStyle,
      fontSize: "15px",
    };

    const messageText = this.add.text(
      this.game.config.width/2-140,
      100,
      "Level Up!!\nPick One",
      {...textStyle, justify: "center"}
    );
    const value = Phaser.Math.Between(2, 3);
    const offset = 200;
    const margin = 50;
    let avaibleBonuses;

    if (gameState.player.heldBonuses.size >= 6) {
      avaibleBonuses = [];

      gameState.player.heldBonuses.forEach((v, e) => {
        avaibleBonuses.push(e);
      });
    } else {
      avaibleBonuses = Object.values(this.bonusesData);
    }

    let avaibleWeapons;
    if (gameState.player.heldWeapons.length >= 6) {
      avaibleWeapons = Object.values(Object.values(this.weaponsData)).filter(
        (e) => gameState.player.heldWeapons.includes(e.name)
      );
    } else {
      avaibleWeapons = Object.values(Object.values(this.weaponsData));
    }
    const selectableItems = [...avaibleBonuses, ...avaibleWeapons];
    Phaser.Utils.Array.Shuffle(selectableItems);

    let selected = 0;
    const buttons = [];

    for (let i = 0; i <= value; i++) {
      const button = this.button(
        config.width / 2,
        offset + margin * i,
        300,
        50,
        "",
        function (b) {
            selected = i;
            updateSelected.call(this);
          }
        )
      const {x, height} = button.getBounds()
      this.add
        .sprite(
          x + 5,
          offset + margin * i ,
          selectableItems[i].icon
        )
        .setScale(0.5)
        .setOrigin(0, 0.5);

      //* title text
      this.add
        .text(
          x + 40,
          offset-height/2 + margin * i,
          `${selectableItems[i].name}`,
          textStyle
        )
        .setDepth(101);
        // .setOrigin(0, 1);
      //* description text
      this.add
        .text(
          x + 40,
          20 + offset -height/2 + margin * i,
          `${selectableItems[i].desc}`,
          textStyle_small
        )
        .setDepth(101);

      // button.setInteractive();
      // button.on("pointerup", function (b) {
      //   selected = i;
      //   updateSelected.call(this);
      // });
      buttons.push(button); // asdded to array to control bounding box
    }

    const exitButton = this.button(
      config.width / 2,
      offset + margin * 5,
      300,
      50,
      `Exit`,
      resumeGame
      )

    const updateSelected = () => {
      buttons.forEach((button) => {
        button.isStroked = false;
      });
      buttons[selected].setStrokeStyle(2, 0xffffff);
      exitButton.setText(
        `Click to select\n${selectableItems[selected].name}`
      );
    };
    updateSelected.call(this);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.up.on("up", () => {
      selected--;
      if (selected < 0) {
        selected = value;
      }
      updateSelected.call(this);
    });

    this.cursors.down.on("up", () => {
      selected++;
      if (selected > value) {
        selected = 0;
      }
      updateSelected.call(this);
    });
    // Adding debug outline to see the bounding box of the text
    messageText.setStroke("#ff0000", 2);
    function resumeGame() {
      if (ok) {
        ok = false;
        const { name, type } = selectableItems[selected];

        if (type === "weapon") {
          this.scene.get(data.level).events.emit("getWeapon", name);
        }
        if (type === "bonus") {
          this.scene.get(data.level).events.emit("getBonus", name);
        }
        this.scene.get("HudScene").events.emit("UpdateHudItemTB");
        this.scene.resume(data.level); 
        this.scene.stop(); 
      }
    }
    const spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    const enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    spaceBar.on("down", resumeGame, this);
    enter.on("down", resumeGame, this);
  }
}
