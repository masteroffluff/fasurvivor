const gameState = {
  kills:0,
  score: 200,
  money: 0,
  width: 2000,
  height: 2000,
  highScore: 100,
  debug: false,
};

const textStyle = {
  fill: "#000",
  fontSize: "20px",
  wordWrap: { width: 280, useAdvancedWrap: true },
  align: "center",
};

let weaponsData, bonusesData;

var publicKey,
  sessionId,
  login_name = "dave";

// Configuration for the Phaser game
const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 600,
  backgroundColor: "aaaaaa",
  physics: {
    default: "arcade",
    arcade: {
      enableBody: true,
      debug: gameState.debug,
    },
  },
  scale: {
    // Fit to window
    mode: Phaser.Scale.FIT,
    // Center vertically and horizontally
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  callbacks: {
    preBoot: (game) => {
      game.events.emit("game-start", { message: "Game has started!" });
    },
  },
  scene: [
    // StartScene,
    // GameScene,
    // PauseScene,
    // HudScene,
    YouDiedScene,
    // LevelUpScene,
    // PickUpItemScene,
    // LoginScene,
    HighScoreScene,
  ],
  parent: "phaser-container",
  dom: {
    createContainer: true, // Enable DOM elements
  },
};

const game = new Phaser.Game(config);
