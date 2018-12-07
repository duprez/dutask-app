import { Observable } from "rxjs";
import { Injectable, Inject } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";

@Injectable()
export class TaskProvider {
  userEmail: string;

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
      this.taskRef
        .where("user", "==", this.userEmail)
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
          // FILTRAR POR ETIQUETAS MODO GITAN
          let _tasks;
          if (params !== "") {
            _tasks = [];
            tasks.forEach(task => {
              if (task.labels.findIndex(label => label.id === params) >= 0) {
                _tasks.push(task);
              }
            });
          }
          observer.next(_tasks ? _tasks : tasks);
        });
    });
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
        .where("user", "==", this.userEmail)
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

  getProjects(): Observable<Project[]> {
    return new Observable(observer => {
      this.projectRef
        .where("user", "==", this.userEmail)
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
}
