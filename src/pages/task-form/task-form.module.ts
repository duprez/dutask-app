import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskFormPage } from './task-form';

@NgModule({
  declarations: [
    TaskFormPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskFormPage),
    FormsModule,
		ReactiveFormsModule,
  ],
  entryComponents: [
    TaskFormPage
  ]
})
export class TaskFormPageModule {}
