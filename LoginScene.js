class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    create(data) {
        const x_offset = 20
        const y_offset = data.y_offset||160

        const graphics = this.add.graphics();
		graphics.fillGradientStyle(0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 1);
        graphics.fillRect(20 + x_offset, 60 + y_offset, 420, 340);
        graphics.lineStyle(1, 0x000000, 1.0);
        graphics.strokeRect(20 + x_offset, 60 + y_offset, 420, 340);
        graphics.beginPath();
        graphics.moveTo(230+ x_offset, 60 + y_offset);
        graphics.lineTo(230+ x_offset, 400 + y_offset);
        graphics.closePath();
        graphics.strokePath();
        
        
        // Add exit button TODO Turn into a regular button
        const exitButton = this.add.dom(410+ x_offset, 70 + y_offset, 'button', {
            style: 'width: 40px; height: 40px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 5px;',
        }, 'X').setOrigin(0,0);

        // Handle button click
        exitButton.addListener('click');
        exitButton.on('click', async () => {
            
            //this.scene.resume('StartScene');
            this.scene.resume(data.level);
            this.scene.stop();
        });
       /////////////// Login ///////////////
       
        // Display text
        this.add.text(40+ x_offset, 80 + y_offset, 'Login', { fontSize: '32px', ...textStyle }).setOrigin(0,0);
        // Add username input
        this.add.text(40+ x_offset, 130 + y_offset, 'User Name', { ...textStyle, fontSize: '16px' }).setOrigin(0,0);
        const usernameInput_login = this.add.dom(40+ x_offset, 160 + y_offset, 'input', {
            type: 'text',
            placeholder: 'Username',
            style: 'width: 200px; height: 30px; font-size: 16px;',
        });
        usernameInput_login.setOrigin(0,0)
        // Add password input
        this.add.text(40+ x_offset, 190 + y_offset, 'Password', { ...textStyle, fontSize: '16px' });
        const passwordInput_login = this.add.dom(40+ x_offset, 220 + y_offset, 'input', {
            //type: 'password',
            placeholder: 'Password',
            style: 'width: 200px; height: 30px; font-size: 16px;',
        });
        passwordInput_login.setOrigin(0,0)
        passwordInput_login.node.setAttribute('type', 'password');

        // Add login button
        const loginButton = this.add.dom(40+ x_offset, 260 + y_offset, 'button', {
            style: 'width: 100px; height: 40px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 5px;',
        }, 'Login').setOrigin(0,0);

        // Handle button click
        loginButton.addListener('click');
        loginButton.on('click', async () => {
            const username = usernameInput_login.node.value;
            const password = passwordInput_login.node.value;
			
            const success = await dologin(username, password);
            if (success) {
                this.scene.resume(data.level);
                this.scene.stop();
            } else {
                alert('Login failed!');
            }
            this.game.events.emit('loginChange', success)
        });
        //////////////////// Register ///////////////
        // Display text
        this.add.text(240+ x_offset, 80 + y_offset, 'Register', { fontSize: '32px', ...textStyle }).setOrigin(0,0);

        // Add username input
        this.add.text(240+ x_offset, 130 + y_offset, 'User Name', { ...textStyle, fontSize: '16px' }).setOrigin(0,0);
        const usernameInput_register = this.add.dom(240+ x_offset, 160 + y_offset, 'input', {
            type: 'text',
            placeholder: 'Username',
            style: 'width: 200px; height: 30px; font-size: 16px;',
        });
        usernameInput_register.setOrigin(0,0)
        // Add password input
        // this.add.text(240, 190, 'email', { ...textStyle, fontSize: '16px' });
        // const emailInput_register = this.add.dom(240, 220, 'input', {
        //     //type: 'password',
        //     placeholder: 'Password',
        //     style: 'width: 200px; height: 30px; font-size: 16px;',
        // });
        this.add.text(240+ x_offset, 190 + y_offset, 'Password', { ...textStyle, fontSize: '16px' });
        const passwordInput_register = this.add.dom(240+ x_offset, 220 + y_offset, 'input', {
            //type: 'password',
            placeholder: 'Password',
            style: 'width: 200px; height: 30px; font-size: 16px;',
        });
        this.add.text(240+ x_offset, 250 + y_offset, 'Repeat Pasword', { ...textStyle, fontSize: '16px' });
        const password2Input_register = this.add.dom(240+ x_offset, 280 + y_offset, 'input', {
            //type: 'password',
            placeholder: 'Password',
            style: 'width: 200px; height: 30px; font-size: 16px;',
        });
        // emailInput_register.setOrigin(0,0)
        passwordInput_register.setOrigin(0,0)
        password2Input_register.setOrigin(0,0)
        passwordInput_register.node.setAttribute('type', 'password');
        password2Input_register.node.setAttribute('type', 'password');
        // Add login button
        const registerButton = this.add.dom(240+ x_offset, 320 + y_offset, 'button', {
            style: 'width: 100px; height: 40px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 5px;',
        }, 'Register').setOrigin(0,0);

        // Handle button click
        registerButton.addListener('click');
        registerButton.on('click', async () => {
            const username = usernameInput_register.node.value;
            const password = passwordInput_register.node.value;
            // const email = emailInput_register.node.value;
            const password2 = password2Input_register.node.value;
            if(password!==password2){
                alert("Passwords must match!")
                return
            }
            const success = await score_register(username, password);
            if (success) {
                this.scene.stop();
                this.scene.resume(data.level);
            } else {
                alert('Register failed!');
            }
            this.game.events.emit('loginChange', success)
        });
        this.events.on('shutdown', () => {
            this.game.events.emit('loginChange')
          });

    }
    
}