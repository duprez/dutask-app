import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskPage } from './task';

@NgModule({
  declarations: [
    TaskPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskPage),
  ],
  entryComponents: [
    TaskPage
  ]
})
export class TaskPageModule {}
