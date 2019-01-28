import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController } from 'ionic-angular';
import { TaskProvider } from '../../providers/task/task';
import { TaskFormPage } from '../task-form/task-form';

// @IonicPage()
@Component({
  selector: 'page-task',
  templateUrl: 'task.html',
})
export class TaskPage {

  task: Task;
  labels: Label[];
  projects: Project[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private taskProvider: TaskProvider,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    this.task = navParams.get('task');
    this.getLabels();
    this.getProjects();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "Deshacer"
    });
    toast.present();
  }

  getLabels() {
    this.taskProvider.getLabels().subscribe(res => {
      this.labels = res;
    });
  }

  getProjects() {
    this.taskProvider.getProjects().subscribe(res => {
      this.projects = res;
    });
  }

  getDate() {
    return new Date(this.task.date);
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  editTask() {
    const modal = this.modalCtrl.create(TaskFormPage, {
      labels: this.labels,
      projects: this.projects,
      task: this.task
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.taskProvider.updateTask(data);
        this.presentToast('Tarea actualizada');
        this.cancel();
      }
    });
  }

}
