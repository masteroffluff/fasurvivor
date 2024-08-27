class HudScene extends Phaser.Scene {
	constructor() {
		super({ key: 'HudScene' })
	}

	create() {
		this.scoreText = this.add.text( 10, 0, `Killed:0`, {
      fontSize: "15px",
      fill: "#000000",
			opacity:0,
    });
		this.healthText = this.add.text( 10, 25, `Health:${gameState.player.hitpoints}`, {
      fontSize: "15px",
      fill: "#000",
			opacity:0,
    });
		this.hiScoreText = this.add.text( 10, 50, `Hi Score:${gameState.highScore}`, {
      fontSize: "15px",
      fill: "#000",
			opacity:0,
    });
		this.xpText = this.add.text( 150, 0, `XP:${gameState.player.xp}/${gameState.player.nextLevel}`, {
      fontSize: "15px",
      fill: "#000",
			opacity:0,
    });
		this.levelText = this.add.text( 150, 25, `Level:${gameState.player.level}`, {
      fontSize: "15px",
      fill: "#000",
			opacity:0,
    });
		const weapons =Array.from( gameState.player.heldWeapons.keys())
		this.heldItemsText  = this.add.text( 150, 50, `Weapons:${weapons.join(", ")}\nBonuses:`, {
      fontSize: "15px",
      fill: "#000",
			opacity:0,
			wordWrap: { width: 240, useAdvancedWrap: true }, 
    });
		// this.statsText  = this.add.text( 300, 0, "", {
    //   fontSize: "15px",
    //   fill: "#fff",
		// 	opacity:0,
		// 	wordWrap: { width: 240, useAdvancedWrap: true }, 
    // });

		// this.bonusesText  = this.add.text( 150, 75, `Bonuses:${gameState.player.heldBonuses.join(", ")}`, {
    //   fontSize: "15px",
    //   fill: "#000",
		// 	opacity:0,
    // });
		//gameState.player.stats
		this.scoreText.setStroke('#ff0000', 2);
		this.scoreText.setLineSpacing(20)
		this.healthText.setStroke('#ff0000', 2);
		this.hiScoreText.setStroke('#ff0000', 2);
		this.xpText.setStroke('#ff0000', 2);
		this.levelText.setStroke('#ff0000', 2);
	}
	update(){
		this.scoreText.setText(`Killed:${gameState.score}`);
		this.healthText.setText(`Health:${Math.floor(gameState.player.hitpoints)}`);
		this.xpText.setText(`XP:${gameState.player.xp}/${gameState.player.nextLevel}`);
		this.levelText.setText(`Level:${gameState.player.level}`);
		const heldBonuses = Array.from(gameState.player.heldBonuses.entries()).map(([e,l])=>e.name+":" + l)
		//console.log(gameState.player.heldBonuses.keys())
		const weapons =Array.from( gameState.player.heldWeapons.keys())
		this.heldItemsText.setText(`Weapons:${weapons.join(", ")}\nBonuses:${heldBonuses.join(", ")}`)
		//const stats = Object.entries(gameState.player.stats).map(([k,v])=>k+":"+v).join("\n")
		//this.statsText.setText(stats)
	}
}