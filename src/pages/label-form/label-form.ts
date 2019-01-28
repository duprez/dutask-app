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
    this.labelForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      color: [
        this.arrayColors[this.selectedColor],
        Validators.required
      ]
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
    this.taskProvider.addLabel(this.labelForm.value).then(res => {
      this.presentToast('Etiqueta guardada');
      this.navCtrl.setRoot(HomePage);
    });
  }

  onChangeColor(color: string) {
    this.labelForm.controls.color.setValue(color);
  }
}
