import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectFormPage } from './project-form';

import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    ProjectFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjectFormPage),
    ColorPickerModule
  ],
  entryComponents: [
    ProjectFormPage
  ]
})
export class ProjectFormPageModule {}
