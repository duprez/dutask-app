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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    public viewCtrl: ViewController
  ) {
    this.taskForm = this.fb.group({
      description: [null, Validators.required],
      date: [new Date(), Validators.required],
      project: [null, Validators.required],
      priority: [false],
      comment: [null],
      labels: []
    });

    this.labels = this.navParams.get('labels');
    this.projects = this.navParams.get('projects');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  onSubmit() {
    this.viewCtrl.dismiss(this.taskForm.value);
  }
}
