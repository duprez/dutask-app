import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LabelFormPage } from './label-form';

import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    LabelFormPage,
  ],
  imports: [
    IonicPageModule.forChild(LabelFormPage),
    ColorPickerModule
  ],
})
export class LabelFormPageModule {}
