import {TaskPage} from "./../task/task";
import {TaskProvider} from "./../../providers/task/task";
import {TaskFormPage} from "./../task-form/task-form";
import {Component, OnInit} from "@angular/core";
import {LoadingController, ModalController, NavController, NavParams, ToastController} from "ionic-angular";
import {CalendarModal, CalendarModalOptions, CalendarResult} from "ion2-calendar";
import * as moment from 'moment';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  taskList: Task[];
  filteredTaskList: Task[];
  labels: Label[];
  projects: Project[];
  
  selectedDay: Date = new Date();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private taskProvider: TaskProvider,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {
    moment.locale('es-ES');
  }

  ngOnInit() {
    this.taskProvider.getUser();
    this.getTasks(this.navParams.get('filter'));
    this.getLabels();
    this.getProjects();
  }

  presentLoading(message: string) {
    let loading = this.loadingCtrl.create({
      content: message
    });
  
    loading.present();
    return loading;
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

  getTasks(filter?: any) {
    console.log('Filtro', filter);
    const loading = this.presentLoading('Cargando sus tareas');
    this.taskProvider.getTasks(filter).subscribe(res => {
      this.taskList = res;
      this.filteredTaskList = this.taskList;
      loading.dismiss();
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
    this.taskProvider.completeTask(task);
    setTimeout(() => {
      this.presentToast("¡Tarea completada!");
    }, 500);
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
    const modal = this.modalCtrl.create(TaskPage, {
      task: task 
    });
    modal.present();
    // this.navCtrl.push(TaskPage, { task: task });
  }
  
  openCalendar() {
    const options: CalendarModalOptions = {
      title: 'Calendario',
      format: 'DD/MM/YYYY',
      doneIcon: true,
      closeIcon: true,
      color: 'dark',
      weekStart: 1,
      weekdays: moment.weekdaysShort(),
      defaultDate: this.selectedDay,
      daysConfig: this.getDayConfig(),
      autoDone: true
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });
 
    myCalendar.present();
 
    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if (date && date !== null && type === 'done') {
        this.selectedDay = date.dateObj;
        this.filterTaskByDate(date.string);
      }
    })
  }

  getDayConfig() {
    let taskFormatedArray = [];
    for (let task of this.taskList) {
      let pushed = false;
      if (taskFormatedArray && taskFormatedArray.length) {
        taskFormatedArray.forEach(taskFormated => {
          if (taskFormated.date === task.date) {
            taskFormated.count += 1;
            pushed = true;
          }
        });
        if (!pushed) {
          taskFormatedArray.push({
            date: task.date,
            count: 1
          });
        }
      } else {
        taskFormatedArray.push({
          date: task.date,
          count: 1
        })
      }
    }
    let daysConfig: {
      date: Date,
      subTitle: string
    }[] = [];
    taskFormatedArray.forEach(taskFormated => {
      daysConfig.push({
        date: new Date(taskFormated.date),
        subTitle: `${taskFormated.count} tarea/s`
      });
    });
    return daysConfig;
  }

  filterTaskByDate(date: string) {
    this.filteredTaskList = this.taskList.filter(task => task.date.toString() === date);
  }
}
