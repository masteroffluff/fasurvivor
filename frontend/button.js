Phaser.Scene.prototype.button = function (
  x,
  y,
  w,
  h,
  text,
  onClick,
  ts = textStyle
) {
  const _button = {};
  // ** Graphics Background ** //
  _button.graphics = this.add.graphics();
  _button.graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
  // ** Interactive Rectangle ** //
  _button.rectangle = this.add.rectangle(x, y, w, h).setOrigin(0.5, 0.5);
  const sb = _button.rectangle.getBounds();
  _button.graphics.fillRect(sb.x, sb.y, sb.width, sb.height);
  _button.rectangle.setStrokeStyle(1, 0x000000);
  _button.rectangle.setInteractive();
  _button.rectangle.on("pointerup", onClick, this);
  _button.rectangle.on("pointerover", () => {
    _button.rectangle.setFillStyle(0xffffff, 0.4);
  });
  _button.rectangle.on("pointerdown", () => {
    _button.rectangle.setFillStyle(0x000000, 0.4);
  });
  _button.rectangle.on("pointerout", () => {
    _button.rectangle.setFillStyle();
  });
  _button.setStrokeStyle = (a,b) => {
    _button.rectangle.setStrokeStyle(a,b)
  }
  _button.getBounds = () =>{
    return _button.rectangle.getBounds()
  }

  // ** Text ** //
  _button.buttonText = this.add
    .text(_button.rectangle.x, _button.rectangle.y, text, ts)
    .setDepth(101)
    .setOrigin(0.5, 0.5);
  _button.setText = (s) => {
    _button.buttonText.setText(s || "");
  };
  // ** Functionality ** 
  _button.hide = () => {
    _button.graphics.setVisible(false);
    _button.buttonText.setVisible(false);
    _button.rectangle.setVisible(false);
  };
  _button.show = () => {
    _button.graphics.setVisible(true);
    _button.buttonText.setVisible(true);
    _button.rectangle.setVisible(true);
  };
  _button.destroy = () => {
    _button.rectangle.destroy()
    _button.buttonText.destroy();
    _button.graphics.destroy();
  };
  return _button;
};
