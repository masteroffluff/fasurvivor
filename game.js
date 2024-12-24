const gameState = {
  score: 0,
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

// prevent addressbar on mobile
window.addEventListener("load", function () {
  // Set a timeout...
  setTimeout(function () {
    // Hide the address bar!
    window.scrollTo(0, 1);
  }, 0);
});

var publicKey,
  sessionId,
  login_name = "";

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
    StartScene,
    GameScene,
    PauseScene,
    HudScene,
    YouDiedScene,
    LevelUpScene,
    PickUpItemScene,
    LoginScene,
    HighScoreScene,
  ],
  parent: "phaser-container",
  dom: {
    createContainer: true, // Enable DOM elements
  },
};
var game;
check_login()
  .then((result) => {
    if (result.logged_in) {
      login_name = result.login_name;

    }


  })
  .catch((error) => {
    console.error("Error during login check:", error);
    alert("Failed to reach server.");
    // Optionally still initialize the game

  })
  .finally(()=>{
    game = new Phaser.Game(config);
  })
  ;
// var game = new Phaser.Game(config);
