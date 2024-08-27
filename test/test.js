class PickUpItemScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PickUpItemScene' });
    }
    preload() {
        this.load.json('bonusesData', '../data/bonusesData.json');
        this.load.json('weaponsData', '../data/weaponsData.json');
        this.load.pack('bonusesPack', '../data/bonusesPack.json')
        this.load.pack('weaponsPack', '../data/weaponsPack.json')
    }

    create(data) {
        function titleCase(str) {
            return str.toLowerCase().split(' ').map(function (word) {
                return (word.charAt(0).toUpperCase() + word.slice(1));
            }).join(' ');
        }
        const textStyle = {
            fill: '#000',
            fontSize: '20px',
            wordWrap: { width: 300, useAdvancedWrap: true },
            align: 'left'
        };
        const textStyle_small = {
            fill: '#000',
            fontSize: '10px',
            wordWrap: { width: 240, useAdvancedWrap: true },
            align: 'left'
        }
        const textStyle_exitButton = {
            fill: '#000',
            fontSize: '15px',
            wordWrap: { width: 300, useAdvancedWrap: true },
            align: 'left'
        }
        //let exitButtonText
        if (!data.value) {
            data = { type: 'weapon', value: 'sword' }
        }
        const { value, type } = data

        let ok = true
        this.input.keyboard.resetKeys()
        let cache
        if (type === 'bonus') {
            cache = this.cache.json.get('bonusesData');
        } else
            if (type === 'weapon') {
                cache = this.cache.json.get('weaponsData');
            }
        const { icon, desc } = cache[value]

        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
        graphics.fillRect(120, 100, 300, 250);
        const messageText = this.add.text(
            130,
            100,
            `${titleCase(data.value)} Found!!!`,
            textStyle
        );
        this.add.sprite(270, 200, icon).setOrigin(0.5,0.5);
        const descText = this.add.text(
            130,
            300,
            desc,
            textStyle_small
        );

        const offset = 200;
        const margin = 50;
        graphics.fillRect(120, offset + margin * 4, 300, 50);

        const yesButton = this.add.rectangle(120, offset + margin * 4, 300, 50).setOrigin(0, 0);
        //exitButton.setFillStyle(0x00FF00)
        //if (this.exitButtonText)  {delete(this.exitButtonText)}
        this.exitButtonText = this.add.text(
            130,
            5 + offset + margin * 4,
            `Yes`,
            textStyle_exitButton
        ).setDepth(101);

        yesButton.setInteractive();
        yesButton.on('pointerup', () => resumeGame(true), this);

        graphics.fillRect(120, offset + margin * 5, 300, 50);

        const noButton = this.add.rectangle(120, offset + margin * 5, 300, 50).setOrigin(0, 0);
        //exitButton.setFillStyle(0x00FF00)
        //if (this.exitButtonText)  {delete(this.exitButtonText)}
        this.noButtonText = this.add.text(
            130,
            5 + offset + margin * 5,
            `No`,
            textStyle_exitButton
        ).setDepth(101);

        noButton.setInteractive();
        noButton.on('pointerup', () => resumeGame(false), this);


        messageText.setStroke('#ff0000', 2);
        function resumeGame(go) {
            if (ok) {
                ok = false
                if (go) {
                    if (data.type === 'weapon') {
                        this.scene.get(data.level).events.emit('getWeapon', data.value)
                    }
                    if (data.type === 'bonus') {
                        this.scene.get(data.level).events.emit('getBonus', data.value)
                    }
                }
                this.scene.resume(data.level);  // Resume the Level scene
                this.scene.stop();  // Stop the PauseScene
            }
        }
        //this.input.on('pointerdown', resumeGame, this)


        const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        const enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        spaceBar.on('down', resumeGame, this)
        enter.on('down', resumeGame, this)


    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [PickUpItemScene],
    backgroundColor: "aaaaaa",
};

const game = new Phaser.Game(config);