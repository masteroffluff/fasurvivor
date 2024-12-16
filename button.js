Phaser.Scene.prototype.button= function(x, y, w, h, text, onClick, ts = textStyle) {
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