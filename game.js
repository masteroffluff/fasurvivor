const gameState = {
  kills: 0,
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
let w = window.innerWidth;
let h = window.innerHeight;
let scaleMode = Phaser.Scale.FIT
if (window.innerWidth > 800) {
  h = window.innerHeight / 1.5;
  w = window.innerWidth / 1.5
  scaleMode= Phaser.Scale.FIT
}

console.log();
const config = {
  type: Phaser.AUTO,
  width: w,
  height: h,
  // min: {
  //   width: 480,
  //   height: 720,
  // },
  // max: {
  //   width: 1280,
  //   height: 1280,
  // },
  // width: 1000,
  // height: 600,
  scale: {
    // Fit to window
    mode: scaleMode,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "aaaaaa",
  physics: {
    default: "arcade",
    arcade: {
      enableBody: true,
      debug: gameState.debug,
    },
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
  .finally(() => {
    document.getElementById("preloader").style.display = "none";
    game = new Phaser.Game(config);
  });
// var game = new Phaser.Game(config);
