import {HomePage} from './../home/home';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskProvider} from './../../providers/task/task';
import {ActionSheetController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Component} from '@angular/core';
import {availablesColors} from "../../shared/colors/availables-colors";

@IonicPage()
@Component({
  selector: 'page-project-form',
  templateUrl: 'project-form.html',
})
export class ProjectFormPage {

  projectId: string;
  project: Project;
  projectForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private taskProvider: TaskProvider,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
  ) {
    this.projectForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      color: [null, Validators.required]
    });

    this.projectId = this.navParams.get('id');
    this.getProject();
  }

  getProject() {
    this.taskProvider.getProject(this.projectId).subscribe(project => {
      this.project = project;
      if (this.project) {
        this.projectForm.patchValue(this.project);
      }
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
    if (this.projectForm.invalid) {
      this.presentToast('¡Atención! Faltan campos por rellenar');
    } else {
      if (this.projectId) {
        this.taskProvider.updateProject(this.project.key, this.projectForm.value).then(res => {
          this.presentToast('Proyecto actualizado');
          this.navCtrl.setRoot(HomePage);
        });
      } else {
        this.taskProvider.addProject(this.projectForm.value).then(res => {
          this.presentToast('Proyecto guardado');
          this.navCtrl.setRoot(HomePage);
        });
      }
    }
  }

  prepareColorSheet() {
    const buttons = [];

    for (let color of availablesColors) {
      buttons.push({
        text: color.name,
        icon: 'square',
        handler: () => {
          this.projectForm.controls.color.setValue(color.color);
          this.projectForm.controls.color.setErrors(null);
        },
        cssClass: color.class
      });
    }

    const actionSheet = this.actionSheetCtrl.create({
      title: 'Colores disponibles',
      cssClass: 'color-options',
      buttons: buttons
    });
    actionSheet.present();
  }
}
