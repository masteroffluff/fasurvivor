// Hide the address bar
window.scrollTo(0, 1);

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
  fontFamily: "courier",
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

function windowConfig() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  let scaleMode = Phaser.Scale.FIT;
  console.log({ w, h });
  if (window.innerWidth > 1280) {
    h /= 1.5;
    w = 800;
    // scaleMode= Phaser.Scale.RESIZE
  }
  if (window.innerWidth < 500) {
    const ratio = w / 500;
    w = 500;

    h /= ratio;
  }
  return { w, h,scaleMode };
}
const { w, h, scaleMode } = windowConfig();

console.log({ w, h });
const config = {
  type: Phaser.AUTO,
  width: w,
  height: h,

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
    BootScene,
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

