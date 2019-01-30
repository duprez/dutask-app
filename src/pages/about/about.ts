import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  socials: {
    name: string,
    icon: string,
    link: string,
    color?: string
  }[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.socials = [
      { name: '@duprez', icon: 'logo-github', link: 'https://github.com/duprez', color: '#fff'},
      { name: 'Antonio Duprez Hernández', icon: 'logo-linkedin', link: 'https://www.linkedin.com/in/antonio-duprez-hern%C3%A1ndez-194670157/', color: '#0078ba'},
      { name: '@duprez26', icon: 'logo-twitter', link: 'https://twitter.com/duprez26', color: '#00a2f8'},
      { name: '@duprez26', icon: 'logo-instagram', link: 'https://www.instagram.com/?hl=es', color: '#fff'},
      { name: 'Antonio Duprez Hernández', icon: 'logo-facebook', link: 'https://es-es.facebook.com/', color: '#34589c'},
    ]
  }

}
