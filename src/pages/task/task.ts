import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-task',
  templateUrl: 'task.html',
})
export class TaskPage {

  task;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.task = navParams.get('task');
  }

  getDate() {
    return new Date(this.task.date);
  }

}
