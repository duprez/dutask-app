import {LoginPage} from './../login/login';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthProvider} from './../../providers/auth/auth';
import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HomePage} from '../home/home';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signUpForm: FormGroup;

	constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private fb: FormBuilder,
    public loadingCtrl: LoadingController
	) {
		this.signUpForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
  }

  presentLoadingLogin() {
    const loader = this.loadingCtrl.create({
      content: "Registrando acceso...",
    });
    loader.present();
    return loader;
  }

  singUp() {
    const loader = this.presentLoadingLogin();
    const data = this.signUpForm.value;
    this.auth.createUser(data.email, data.password)
      .then(res => {
        this.auth.signInWithEmail(data.email, data.password).then(
          () => {
            this.auth.checkUserState().subscribe(user => {
              this.auth.saveUserOnLocalStorage(user);
              loader.dismiss();
              this.navCtrl.setRoot(HomePage, {user: user.email});
            });
          }
        );
      })
    .catch(err => console.log(err));
  }

  goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }

}
