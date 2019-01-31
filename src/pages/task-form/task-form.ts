import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-task-form",
  templateUrl: "task-form.html"
})
export class TaskFormPage {
  taskForm: FormGroup;
  labels: Label[];
  projects: Project[];

  task: Task;
  year: number = new Date().getFullYear();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    public viewCtrl: ViewController
  ) {
    this.labels = this.navParams.get('labels');
    this.projects = this.navParams.get('projects');
    this.task = this.navParams.get('task');
  
    this.taskForm = this.fb.group({
      id: [this.task ? this.task.id : null],
      description: [this.task ? this.task.description : null, Validators.required],
      date: [this.task ? this.task.date : new Date(), Validators.required],
      project: [this.task ? this.task.project : null, Validators.required],
      priority: [this.task ? this.task.priority : false],
      comment: [this.task ? this.task.comment : null],
      labels: [this.task ? this.task.labels : null]
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  onSubmit() {
    this.viewCtrl.dismiss(this.taskForm.value);
  }

  projectCompare(
    a:{ color: string, id: string, key: string, name: string},
    b: { color: string, id: string, key: string, name: string}
  ) {
    if (a.key === b.key) {
      return true;
    }
    return false;
  }

  labelCompare(
    a:{ color: string, id: string, key: string, name: string},
    b: { color: string, id: string, key: string, name: string}
  ) {
    if (a.key === b.key) {
      return true;
    }
    return false;
  }
}
