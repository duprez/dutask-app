import { TaskFormPageModule } from "./../pages/task-form/task-form.module";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "ionic-angular";
import { TaskListComponent } from "./task-list/task-list";

@NgModule({
  declarations: [TaskListComponent],
  imports: [FormsModule, ReactiveFormsModule, IonicModule, TaskFormPageModule],
  exports: [TaskListComponent],
  entryComponents: []
})
export class ComponentsModule {}
