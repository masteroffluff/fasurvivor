class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        if (isMobileDevice()) {
            this.scale.startFullscreen();
        } else {
            this.scale.resize(800, 600);
        }

        // Start the next scene after setting the screen mode
        this.scene.start('StartScene');
    }
}

// Function to check if running on mobile
function isMobileDevice() {
    return window.innerWidth < 768; // Adjust threshold as needed
}