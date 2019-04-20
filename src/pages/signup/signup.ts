import { LoginPage } from './../login/login';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

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
		private fb: FormBuilder
	) {
		this.signUpForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
  }

  singUp() {
	  console.log('Entro a signup');
    const data = this.signUpForm.value;
    this.auth.createUser(data.email, data.password)
    .then(res => this.navCtrl.setRoot(HomePage))
    .catch(err => console.log(err));
  }

  goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }

}
