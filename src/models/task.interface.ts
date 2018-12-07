interface Task {
  user?: string;
  id?: string;
  description: string;
  date: Date;
  priority: boolean;
  labels: Label[];
  project: Project;
  comment: string;
}
