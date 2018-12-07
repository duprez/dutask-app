import { HomePage } from './../home/home';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskProvider } from './../../providers/task/task';
import { ToastController } from 'ionic-angular';
import { Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-project-form',
  templateUrl: 'project-form.html',
})
export class ProjectFormPage {

  projectForm: FormGroup;
  colors;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private taskProvider: TaskProvider,
    private toastCtrl: ToastController
  ) {
    this.projectForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      color: [null, Validators.required]
    });

    this.colors = [
      { name: "red", color: "#b60205" },
      { name: "light red", color: "#e99695" },
      { name: "orange", color: "#d93f0b" },
      { name: "light orange", color: "#f9d0c4" },
      { name: "yellow", color: "#fbca04" },
      { name: "light yellow", color: "#fef2c0" },
      { name: "green", color: "#0e8a16" },
      { name: "light green", color: "#c2e0c6" },
      { name: "blue", color: "#1d76db" },
      { name: "light blue", color: "#c5def5" },
      { name: "light violet", color: "#d4c5f9" }
    ];
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  onSubmit() {
    this.taskProvider.addProject(this.projectForm.value).then(res => {
      this.presentToast('Proyecto guardado');
      this.navCtrl.setRoot(HomePage);
    });
  }
}
