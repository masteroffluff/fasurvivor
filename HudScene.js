class IconThingy {
  static symbol = '■';
  static textStyle = {
    fontSize: "8px",
    fill: "#ff0",
    stroke: "#000",
    strokeThickness: 1,
    opacity: 0,
  };
  constructor(scene, thing, x, y) {
    scene.add.image(x, y, thing.icon).setScale(0.5).setOrigin(0, 0.5);
    this.thing = thing;
    this.x = x;
    this.y = y;

    this._level = 1;
    this.text = scene.add.text(x, y + 16, IconThingy.symbol, IconThingy.textStyle);

  }

  update() {
    this.level = gameState.player.heldWeapons.get(thing);
    this.text.setText(IconThingy.symbol.repeat(this.level));
  }
}

class HudScene extends Phaser.Scene {
  constructor() {
    super({ key: "HudScene" });
  }
  update() {
    this.load.pack("bonusesPack", "./data/bonusesPack.json");
    this.load.pack("weaponsPack", "./data/weaponsPack.json");
  }

  iconThingyBuilder(){
    
  }
  create() {
    this.weaponOffSetX = 16;
    this.weaponOffSetY = 32;

    

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
