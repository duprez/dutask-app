import { TaskPage } from "./../task/task";
import { TaskProvider } from "./../../providers/task/task";
import { TaskFormPage } from "./../task-form/task-form";
import { Component, OnInit } from "@angular/core";
import { NavController, ModalController, ToastController, NavParams } from "ionic-angular";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  taskList: Task[];
  labels: Label[];
  projects: Project[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private taskProvider: TaskProvider,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getTasks(this.navParams.get('filter'));
    this.getLabels();
    this.getProjects();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "top",
      showCloseButton: true,
      closeButtonText: "Deshacer"
    });
    toast.present();
  }

  getTasks(filter?: any) {
    this.taskProvider.getTasks(filter).subscribe(res => {
      this.taskList = res;
    });
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

  completeTask(task: Task) {
    this.taskProvider.completeTask(task).then(res => {
      this.presentToast("¡Tarea completada!");
    });
  }

  openTaskForm() {
    const modal = this.modalCtrl.create(TaskFormPage, {
      labels: this.labels,
      projects: this.projects
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.addTask(data);
      }
    });
  }

  addTask(task: any) {
    this.taskProvider.addTask(task).then(res => {
      this.presentToast("¡Tarea añadida!");
    });
  }

  selectTask(task: Task) {
    this.navCtrl.push(TaskPage, { task: task });
  }
}
