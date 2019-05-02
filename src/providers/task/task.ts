import {Observable} from "rxjs";
import {Inject, Injectable} from "@angular/core";
import {AngularFirestore} from "angularfire2/firestore";
import {SESSION_STORAGE, StorageService} from "ngx-webstorage-service";

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
      console.log('this.userEmail', this.userEmail);
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
          console.log('Before', tasks);
          observer.next(
            this.filterTasksByLabelsOrProject(tasks, params)
          );
          console.log('after', this.filterTasksByLabelsOrProject(tasks, params));
        });
    });
  }

  filterTasksByLabelsOrProject(tasks: Task[], params: any) {
    if (params && params !== "") {
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
    setTimeout(() => {
      return this.db
        .collection("task")
        .doc(task.id)
        .delete();
    }, 500);
  }

  updateTask(task: Task) {
    return this.db.collection("task")
    .doc(task.id)
    .update({
      user: this.userEmail,
      project: task.project,
      priority: task.priority,
      labels: task.labels,
      description: task.description,
      date: task.date,
      comment: task.comment
    });
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

  getLabel(labelId: string): Observable<Label> {
    return new Observable(observer => {
      this.getLabels().subscribe((labels: Label[]) => {
        const label = labels.find(_label => _label.id === labelId);
        observer.next(label);
      });
    });
  }

  addLabel(label: Label) {
    label.user = this.userEmail;
    console.log('this.userEmail', this.userEmail, label.user);
    return this.db.collection("labels").add(label);
  }

  updateLabel(labelKey: string, label: Label) {
    return this.db.collection("labels")
      .doc(labelKey)
      .update({
        color: label.color,
        id: label.id,
        name: label.name
      });
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

  getProject(projectId: string): Observable<Project> {
    return new Observable(observer => {
      this.getProjects().subscribe((projects: Project[]) => {
        const project = projects.find(_project => _project.id === projectId);
        observer.next(project);
      });
    });
  }

  addProject(project: Project) {
    project.user = this.userEmail;
    return this.db.collection("projects").add(project);
  }

  updateProject(projectKey: string, project: Project) {
    return this.db.collection("projects")
      .doc(projectKey)
      .update({
        color: project.color,
        id: project.id,
        name: project.name
      });
  }

  removeProject(project: Project) {
    return this.db
      .collection("projects")
      .doc(project.id)
      .delete();
  }
}
