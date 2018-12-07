import { AuthProvider } from "./../../providers/auth/auth";
import { HomePage } from "./../home/home";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SignupPage } from "../signup/signup";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  loginForm: FormGroup;
  loginError: string;

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private fb: FormBuilder
  ) {
    this.loginForm = fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
		});
		
		this.auth.checkLoggedIn().subscribe(res => {
			if (res) {
				this.navCtrl.setRoot(HomePage);
			}
		});
  }

  login() {
    const data = this.loginForm.value;
    this.auth.signInWithEmail(data.email, data.password).then(
      () => {
        this.auth.checkUserState().subscribe(user => {
          this.auth.saveUserOnLocalStorage(user);
          this.navCtrl.setRoot(HomePage, { user: user.email });
        });
      },
      error => (this.loginError = error.message)
    );
  }

  loginWithGoogle() {
    this.auth.signInWithGoogle().then(
      () => {
        this.auth.checkUserState().subscribe(user => {
          this.auth.saveUserOnLocalStorage(user);
          this.navCtrl.setRoot(HomePage, { user: user.email });
        });
      },
      error => console.log(error.message)
    );
  }

  singUp() {
    this.navCtrl.push(SignupPage);
  }
}
