import {AuthProvider} from "./../../providers/auth/auth";
import {HomePage} from "./../home/home";
import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SignupPage} from "../signup/signup";

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
    console.log('Entro');
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
      res => {
        this.auth.checkUserState().subscribe(user => {
          console.log('entro aqui 2', user);
          this.auth.saveUserOnLocalStorage(user);
          this.navCtrl.setRoot(HomePage, {user: user.email});
        });
        console.log(res);
      },
      error => console.log(error.message)
    );
  }

  loginWithGithub() {
    this.auth.signInWithGithub().then(res => {
      this.auth.checkUserState().subscribe(user => {
        this.auth.saveUserOnLocalStorage(user);
        this.navCtrl.setRoot(HomePage);
      });
    }, error => console.log(error.message));
  }

  loginWithFacebook() {
    this.auth.signInWithFacebook().then(res => {
      this.auth.checkUserState().subscribe(user => {
        this.auth.saveUserOnLocalStorage(user);
        this.navCtrl.setRoot(HomePage);
      });
    }, error => console.log(error.message));
  }

  singUp() {
    this.navCtrl.push(SignupPage);
  }
}
