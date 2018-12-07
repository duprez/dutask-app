import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LabelFormPage } from './label-form';

@NgModule({
  declarations: [
    LabelFormPage,
  ],
  imports: [
    IonicPageModule.forChild(LabelFormPage)
  ],
})
export class LabelFormPageModule {}
