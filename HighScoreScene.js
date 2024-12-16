class HighScoreScene extends Phaser.Scene {
  constructor() {
    super({ key: "HighScoreScene" });
  }
  // button(x, y, w, h, text, onClick, ts = textStyle) {
  //   const graphics = this.add.graphics();
  //   graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
  //   const button1 = this.add.rectangle(x, y, w, h).setOrigin(0.5, 0.5);
  //   const sb = button1.getBounds();
  //   graphics.fillRect(sb.x, sb.y, sb.width, sb.height);
  //   button1.setStrokeStyle(1, 0x000000);

  //   this.startButtonText = this.add
  //     .text(button1.x, button1.y, text, ts)
  //     .setDepth(101);
  //   this.startButtonText.setOrigin(0.5, 0.5);
  //   button1.setInteractive();
  //   button1.on("pointerup", onClick, this);
  //   button1.on("pointerover", () => {
  //     button1.setFillStyle(0xffffff, 0.4);
  //   });
  //   button1.on("pointerdown", () => {
  //     button1.setFillStyle(0x000000, 0.4);
  //   });
  //   button1.on("pointerout", () => {
  //     button1.setFillStyle();
  //   });
  // }

  create(data) {
    const graphics = this.add.graphics();
    const maskGraphics = this.add.graphics();
    const x = 60,
      y = 220,
      w = 400,
      h = 340;
    graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
    graphics.fillRect(x, y, w, h);
    graphics.lineStyle(1, 0);
    graphics.strokeRect(x, y, w, h);
    graphics.moveTo(x, y + 40);
    graphics.lineTo(x + w, y + 40);
    graphics.closePath();
    graphics.strokePath();

    this.add
      .text(x + w / 2, y + 20, "High Scores", {
        ...textStyle,
        fontSize: "30px",
      })
      .setOrigin(0.5);

    this.button(x+w-20, y+20, 20, 20, "X", () => {
      this.scene.resume(data.level);
      this.scene.stop();
    });

    maskGraphics.fillRect(x, y + 40, w, h - 40);
    const mask = new Phaser.Display.Masks.GeometryMask(this, maskGraphics);

    const text = this.add
      .text(160, 280, "Please wait loading highscore", textStyle)
      .setOrigin(0);

    text.setMask(mask);

    const catcher = this.add
      .rectangle(x, y - 30, w, 10)

      .setOrigin(0);
    this.physics.add.existing(catcher, false);
    catcher.body.setImmovable();
    catcher.name = "catcher";

    const highScores = this.physics.add.group();

    this.lastYPos = y + h;
    this.physics.add.overlap(catcher, highScores, (_, highScore) => {
      highScore.y = this.lastYPos;
    });

    get_highscore().then((highScore) => {
      text.destroy();
      let i = 1;
      highScore.forEach((hs) => {
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
    });
  }
}
