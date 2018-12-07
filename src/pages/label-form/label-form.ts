import { Validators } from "@angular/forms";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController } from "ionic-angular";
import { TaskProvider } from "../../providers/task/task";
import { HomePage } from "../home/home";

@IonicPage()
@Component({
  selector: "page-label-form",
  templateUrl: "label-form.html"
})
export class LabelFormPage {
  labelForm: FormGroup;
  colors;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private taskProvider: TaskProvider,
    private toastCtrl: ToastController
  ) {
    this.labelForm = this.fb.group({
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
    this.taskProvider.addLabel(this.labelForm.value).then(res => {
      this.presentToast('Etiqueta guardada');
      this.navCtrl.setRoot(HomePage);
    });
  }
}
