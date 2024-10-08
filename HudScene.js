class HudScene extends Phaser.Scene {
	constructor() {
		super({ key: 'HudScene' })
	}

	create() {
		const textStyle = {
      fontSize: "15px",
      fill: "#000000",
			stroke:"#f00",
			strokeThickness:1,
			opacity:0,
    }
		this.scoreText = this.add.text( 10, 0, `Killed:0`, textStyle);
		this.healthText = this.add.text( 10, 25, `Health:${gameState.player.hitpoints}`, textStyle);
		this.hiScoreText = this.add.text( 10, 50, `Hi Score:${gameState.highScore}`, textStyle);
		this.xpText = this.add.text( 150, 0, `XP:${gameState.player.xp}/${gameState.player.nextLevel}`, textStyle);
		this.levelText = this.add.text( 150, 25, `Level:${gameState.player.level}`, textStyle);
		const weapons =Array.from( gameState.player.heldWeapons.keys())
		this.heldItemsText  = this.add.text( 150, 50, `Weapons:${weapons.join(", ")}\nBonuses:`, {
			...textStyle,
			wordWrap: { width: 240, useAdvancedWrap: true }, 
    });

	}
	update(){
		this.scoreText.setText(`Killed:${gameState.score}`);
		this.healthText.setText(`Health:${Math.floor(gameState.player.hitpoints)}`);
		this.xpText.setText(`XP:${gameState.player.xp}/${gameState.player.nextLevel}`);
		this.levelText.setText(`Level:${gameState.player.level}`);
		const heldBonuses = Array.from(gameState.player.heldBonuses.entries()).map(([e,l])=>e.name+":" + l)

		const weapons = Array.from(gameState.player.heldWeapons.entries()).map(([e,l])=>e.name+":" + l)
		this.heldItemsText.setText(`Weapons:${weapons.join(", ")}\nBonuses:${heldBonuses.join(", ")}`)

	}
}