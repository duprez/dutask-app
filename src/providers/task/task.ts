import { Observable } from "rxjs";
import { Injectable, Inject } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";

@Injectable()
export class TaskProvider {
  userEmail: string = '';

  taskRef = this.db.firestore.collection("task");
  labelRef = this.db.firestore.collection("labels");
  projectRef = this.db.firestore.collection("projects");

  constructor(
    private db: AngularFirestore,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {
    this.getUser();
  }

  getUser() {
    this.userEmail = this.storage.get("email");
  }

  getTasks(params: any = ""): Observable<Task[]> {
    return new Observable(observer => {
      const query = this.taskRef;
      this.taskRef
        .where("user", "==", (this.userEmail || null))
        .onSnapshot(querySnapshot => {
          let tasks: Task[] = [];
          querySnapshot.forEach(doc => {
            let data = doc.data();
            tasks.push({
              id: doc.id,
              description: data.description,
              date: data.date,
              project: data.project,
              priority: data.priority,
              labels: data.labels,
              comment: data.comment
            });
          });
          observer.next(
            this.filterTasksByLabelsOrProject(tasks, params)
          );
        });
    });
  }

  filterTasksByLabelsOrProject(tasks: Task[], params: any) {
    if (params !== "") {
      // FILTRAR POR ETIQUETAS MODO GITAN
      let _tasks = [];
      tasks.forEach(task => {
        if (
          task.labels && 
          task.labels.length &&
          task.labels.findIndex(label => label.id === params) >= 0) {
          _tasks.push(task);
        } else if (
          task.project && 
          task.project.id === params
        ) {
          _tasks.push(task);
        }
      });
      return _tasks;
    } else {
      return tasks;
    }
  }

  completeTask(task: Task) {
    return this.db
      .collection("task")
      .doc(task.id)
      .delete();
  }

  addTask(task: Task) {
    task.user = this.userEmail;
    return this.db.collection("task").add(task);
  }

  getLabels(): Observable<Label[]> {
    return new Observable(observer => {
      this.labelRef
        .where("user", "==", (this.userEmail || null))
        .onSnapshot(querySnapshot => {
          let labels: Label[] = [];
          querySnapshot.forEach(doc => {
            let data = doc.data();
            labels.push({
              key: doc.id,
              id: data.id,
              name: data.name,
              color: data.color
            });
          });
          observer.next(labels);
        });
    });
  }

  addLabel(label: Label) {
    label.user = this.userEmail;
    return this.db.collection("labels").add(label);
  }

  removeLabel(label: Label) {
    return this.db
      .collection("labels")
      .doc(label.id)
      .delete();
  }

  getProjects(): Observable<Project[]> {
    return new Observable(observer => {
      this.projectRef
        .where("user", "==", (this.userEmail || null))
        .onSnapshot(querySnapshot => {
          let projects: Project[] = [];
          querySnapshot.forEach(doc => {
            let data = doc.data();
            projects.push({
              key: doc.id,
              id: data.id,
              name: data.name,
              color: data.color
            });
          });
          observer.next(projects);
        });
    });
  }

  addProject(project: Project) {
    project.user = this.userEmail;
    return this.db.collection("projects").add(project);
  }

  removeProject(project: Project) {
    return this.db
      .collection("projects")
      .doc(project.id)
      .delete();
  }
}
