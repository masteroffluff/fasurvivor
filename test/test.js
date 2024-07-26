class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }
    create(data) {
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
        graphics.fillRect(120, 250, 300, 50);

        WebFont.load({
            google: {
                families: ['Roboto']
            },
            active: () => {
                const textStyle = { 
                    fill: '#000', 
                    fontFamily: 'Roboto', 
                    fontSize: '20px', 
                    align: 'center', 
                    wordWrap: { width: 280, useAdvancedWrap: true }
                };

                const pauseText = this.add.text(
                    270, // Center of the box horizontally (120 + 300 / 2)
                    275, // Center of the box vertically (250 + 50 / 2)
                    'Paused:\nPress "P" to unpause.', 
                    textStyle
                ).setOrigin(0.5); // Set origin to the center of the text

                // Adding debug rectangle to see the bounding box of the text
                const bounds = pauseText.getBounds();
                graphics.lineStyle(2, 0xff0000);
                graphics.strokeRectShape(bounds);
            }
        });

        this.input.keyboard.on('keydown-P', () => {
            this.scene.resume(data.level);  // Resume the Level scene
            this.scene.stop();  // Stop the PauseScene
        });
    }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [PauseScene],
  backgroundColor: "aaaaaa",
};

const game = new Phaser.Game(config);