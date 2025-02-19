class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    preload() {
        console.log("gamescene preload")
        this.load.json("bonusesData", "data/bonusesData.json");
        this.load.json("weaponsData", "data/weaponsData.json");
    
        this.load.image(
          "enemy1",
          "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png"
        );
        this.load.image(
          "enemy2",
          "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_2.png"
        );
        this.load.image(
          "player",
          "https://content.codecademy.com/courses/learn-phaser/codey.png"
        );
        this.load.spritesheet("bombExplosion", "./imgs/bombExplosion.png", {
          frameWidth: 64,
          frameHeight: 64,
        });
    
        this.load.spritesheet("playerController", "./imgs/controller.png", {
          frameWidth: 64,
          frameHeight: 64,
        });
    
        this.load.image("gem1", "./imgs/gem1.png");
        this.load.image("heart", "./imgs/heart.png");
        this.load.image("crate", "./imgs/crate.png");
        this.load.image("background", "./imgs/grassTile.png");
        this.load.pack("bonusesPack", "./data/bonusesPack.json");
        this.load.pack("weaponsPack", "./data/weaponsPack.json");
        this.load.svg(
            "logo",
            "https://upload.wikimedia.org/wikipedia/commons/6/6c/Codecademy.svg"
          );
          this.load.svg("survivors", "./imgs/survivors.svg");
      }
    create() {

        // Start the next scene after loading the stuffs
        this.scene.start('StartScene');
    }
}

// Function to check if running on mobile
function isMobileDevice() {
    return window.innerWidth < 768; // Adjust threshold as needed
}