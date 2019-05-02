import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Component} from "@angular/core";
import {ActionSheetController, IonicPage, NavController, NavParams, ToastController} from "ionic-angular";
import {TaskProvider} from "../../providers/task/task";
import {HomePage} from "../home/home";
import {availablesColors} from '../../shared/colors/availables-colors';

@IonicPage()
@Component({
  selector: "page-label-form",
  templateUrl: "label-form.html"
})
export class LabelFormPage {

  labelId: string;
  label: Label;
  labelForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private taskProvider: TaskProvider,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.labelForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      color: [null, Validators.required]
    });

    this.labelId = this.navParams.get('id');
    this.getLabel();
  }

  getLabel() {
    this.taskProvider.getLabel(this.labelId).subscribe(label => {
      this.label = label;
      if (this.label) {
        this.labelForm.patchValue(this.label);
      }
    });
  }

  presentToast(message, cssClass?: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "bottom",
      cssClass: cssClass
    });
    toast.present();
  }

  onSubmit() {
    if (this.labelForm.invalid) {
      this.presentToast('¡Atención! Faltan campos por rellenar', 'alert-toast');
    } else {
      if (this.labelId) {
        this.taskProvider.updateLabel(this.label.key, this.labelForm.value).then(res => {
          this.presentToast('Etiqueta actualizado', 'success-toast');
          this.navCtrl.setRoot(HomePage);
        });
      } else {
        console.log('Creando etiqueta');
        this.taskProvider.addLabel(this.labelForm.value).then(res => {
          this.presentToast('Etiqueta guardada', 'success-toast');
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
          this.labelForm.controls.color.setValue(color.color);
          this.labelForm.controls.color.setErrors(null);
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
