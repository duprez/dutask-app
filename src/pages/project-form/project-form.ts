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

  selectedColor: string = 'color1';
  arrayColors: any = {
    color1: '#2883e9',
    color2: '#e920e9',
    color3: 'rgb(255,245,0)',
    color4: 'rgb(236,64,64)',
    color5: 'rgba(45,208,45,1)'
  };


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
      color: [this.arrayColors[this.selectedColor], Validators.required]
    });
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }

  onSubmit() {
    this.taskProvider.addProject(this.projectForm.value).then(res => {
      this.presentToast('Proyecto guardado');
      this.navCtrl.setRoot(HomePage);
    });
  }

  onChangeColor(color: string) {
    this.projectForm.controls.color.setValue(color);
  }
}
