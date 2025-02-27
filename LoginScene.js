class LoginScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoginScene" });
  }

  create(data) {
    const formContainerParent = document.getElementById(
      "form-container-parent"
    );

    formContainerParent.classList.remove("hidden");

    const exitFormButton = document.getElementById("exit-form-button");
    const loginUserName = document.getElementById("login-user-name");
    const loginPassword = document.getElementById("login-password");
    const submitLogin = document.getElementById("submit-login");
    const registerUserName = document.getElementById("register-user-name");
    const registerPassword1 = document.getElementById("register-password-1");
    const registerPassword2 = document.getElementById("register-password-2");
    const submitRegister = document.getElementById("submit-register");

    exitFormButton.addEventListener("click", () => {
      this.scene.resume(data.level);
      this.scene.stop();
    });

    submitLogin.addEventListener("click", async (e) => {
      e.preventDefault();
      const username = loginUserName.value;
      const password = loginPassword.value;

      const success = await dologin(username, password);
      if (success) {
        this.scene.resume(data.level);
        this.scene.stop();
      } else {
        alert("Login failed!");
      }
      //   this.game.events.emit("loginChange", success);
    });

    submitRegister.addEventListener("click", async () => {
      const username = registerUserName.value;
      const password = registerPassword1.value;
      const password2 = registerPassword2.value;
      if (password !== password2) {
        alert("Passwords must match!");
        return;
      }
      const success = await score_register(username, password);
      if (success) {
        this.scene.stop();
        this.scene.resume(data.level);
      } else {
        alert("Register failed!");
      }
      // this.game.events.emit('loginChange', success)
    });

    this.events.on("shutdown", () => {
      formContainerParent.classList.add("hidden");
      this.game.events.emit("loginChange");
    });
    
  }
}
