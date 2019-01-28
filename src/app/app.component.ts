import { ProjectFormPage } from './../pages/project-form/project-form';
import { AuthProvider } from './../providers/auth/auth';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { TaskProvider } from '../providers/task/task';
import { LabelFormPage } from '../pages/label-form/label-form';
import { SignupPage } from '../pages/signup/signup';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any, actions?: any[], pages?: any[]}>;
  labels: Label[];
  projects: Project[];

  user: User;

  configLabels: boolean;
  configProjects: boolean;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public auth: AuthProvider,
    public menu: MenuController,
    private tasksProvider: TaskProvider,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Tareas', component: HomePage },
      { title: 'Etiquetas', component: null, actions: [
        { icon: 'construct', component: null },
        { icon: 'add', component: LabelFormPage },
        ], pages: [] 
      },
      { title: 'Proyectos', component: null, actions: [
        { icon: 'construct', component: null },
        { icon: 'add', component: ProjectFormPage },
        ], pages: []
      }
    ];
  }
  
  ngOnInit() {
    this.nav.viewDidEnter.subscribe(res => {
      this.rootPage = res.component;
      if (this.rootPage !== LoginPage && this.rootPage !== SignupPage) {
        this.tasksProvider.getUser();
        this.getLabels();
        this.getProjects();
        this.getUser();
      }
    });
  }

  getUser() {
    this.user = this.auth.getLoggedUser();
  }

  getLabels() {
    this.tasksProvider.getLabels().subscribe(res => {
      this.labels = res;
      this.pages[1].pages = [];
      this.labels.forEach(label => {
        this.pages[1].pages.push({
          id: label.key,
          title: label.name,
          color: label.color,
          component: HomePage,
          param: label.id
        });
      });
    });
  }

  getProjects() {
    this.tasksProvider.getProjects().subscribe(res => {
      this.projects = res;
      this.pages[2].pages = [];
      this.projects.forEach(project => {
        this.pages[2].pages.push({
          id: project.key,
          title: project.name,
          color: project.color,
          component: HomePage,
          param: project.id
        });
      })
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component !== null) {
      this.menu.close();
      this.nav.setRoot(page.component, { filter: page.param });
    }
  }

  logout() {
    this.auth.logout().subscribe(res => {
      this.menu.close();
      this.nav.setRoot(LoginPage);
    });
  }
  
  onAction(component: string, type: string) {
    console.log(type);
    if (component !== null) {
      this.menu.close();
      this.nav.setRoot(component);
    } else {
      switch (type.toUpperCase()) {
        case 'ETIQUETAS':
          this.configLabels = !this.configLabels;
          break;
        case 'PROYECTOS':
          this.configProjects = !this.configProjects;
          break;
      }
    }
  }

  removeSubpage(subpage, type: string) {
    let text;
    let mode;
    switch (type) {
      case 'ETIQUETAS':
        text = 'la etiqueta';
        mode = 1;
        break;
      case 'PROYECTOS':
        text = 'el proyecto';
        mode = 2;
        break;
    }
    let alert = this.alertCtrl.create({
      title: 'Borrar etiqueta',
      message: `¿Está seguro de que quiere borrar ${text} "${subpage.title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: () => {
            switch (mode) {
              case 1:
                this.tasksProvider.removeLabel(subpage);
                break;
              case 2:
                this.tasksProvider.removeProject(subpage);
                break;
            }
          }
        }
      ]
    });
    alert.present();
  }
}
