class IconThingy {
  static symbol = "■";
  static textStyle = {
    fontSize: "8px",
    fill: "#ff0",
    stroke: "#000",
    strokeThickness: 1,
    opacity: 1,
  };
  constructor(scene, thing, x, y) {
    console.log("creating")
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

  update(x,y) {
    console.log("updating")
    this.x = x
    this.y = y
    this.sprite.setPosition(x, y)
    this.text.setPosition(x,y+16)
    this.level = gameState.player.heldWeapons.get(this.thing)||1;
    this.text.setText(IconThingy.symbol.repeat(this.level));
  }
}
class IconThingyBar {
  constructor(scene, xOffset, yOffset) {
    this.map = new Map();
    this.scene = scene
    this.xOffset = xOffset
    this.yOffset = yOffset

  }
  update() {


    const xmult = 32;
    const ymult = 40;
    let x = 0;
    let y = 0;
    const  setUpRows = (itemMap) => {
      let rows = 1;
      for (const [item,_] of itemMap) {
        if (x >= 7) {
          x = 0;
          y++;
          rows++;
        }
        if (this.map.has(item)){
          this.map.get(item).update(x * xmult + this.xOffset, y * ymult + this.yOffset)
        } else {
        this.map.set(
          item,
          new IconThingy(this.scene, item, x * xmult + this.xOffset, y * ymult + this.yOffset)
        );
        }
        x++
      }

      return rows;
    }
    const wRows = setUpRows(gameState.player.heldWeapons)
    x = 0;
    y++;
    const bRows = setUpRows(gameState.player.heldBonuses)
    console.log(this.map)
  }
}

class HudScene extends Phaser.Scene {
  constructor() {
    super({ key: "HudScene" });
  }
  preload() {
    this.load.pack("bonusesPack", "./data/bonusesPack.json");
    this.load.pack("weaponsPack", "./data/weaponsPack.json");
  }

  create() {
    this.weaponOffSetX = 16;
    this.weaponOffSetY = 32;

    this.iconThingyBar = new IconThingyBar(this, this.weaponOffSetX, this.weaponOffSetY);
    this.events.on('UpdateHudItemTB', (w) => {
      this.iconThingyBar.update()
    }, this)
    this.iconThingyBar.update();
    if (gameState.debug) {
      const textStyle = {
        fontSize: "15px",
        fill: "#000000",
        stroke: "#f00",
        strokeThickness: 1,
        opacity: 0,
      };
      this.scoreText = this.add.text(10, 0, `Killed:0`, textStyle);
      this.healthText = this.add.text(
        10,
        25,
        `Health:${gameState.player.hitpoints}`,
        textStyle
      );
      this.hiScoreText = this.add.text(
        10,
        50,
        `Hi Score:${gameState.highScore}`,
        textStyle
      );
      this.xpText = this.add.text(
        150,
        0,
        `XP:${gameState.player.xp}/${gameState.player.nextLevel}`,
        textStyle
      );
      this.levelText = this.add.text(
        150,
        25,
        `Level:${gameState.player.level}`,
        textStyle
      );
      const weapons = Array.from(gameState.player.heldWeapons.keys());
      this.heldItemsText = this.add.text(
        150,
        50,
        `Weapons:${weapons.join(", ")}\nBonuses:`,
        {
          ...textStyle,
          wordWrap: { width: 240, useAdvancedWrap: true },
        }
      );
    }

  }
  update() {

    if (gameState.debug) {
      this.scoreText.setText(`Killed:${gameState.score}`);
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
