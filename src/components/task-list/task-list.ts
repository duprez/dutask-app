import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'task-list',
  templateUrl: 'task-list.html'
})
export class TaskListComponent {

  @Input() tasks: Task[];

  @Output() completeTask = new EventEmitter<any>();
  @Output() selectTask = new EventEmitter<any>();

  constructor() { }

  onCompleteTask(task: Task) {
    this.completeTask.emit({task: task});
  }

  taskSelected(task: Task) {
    this.selectTask.emit({task: task});
  }
}
