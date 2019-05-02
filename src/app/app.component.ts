import {ProjectFormPage} from './../pages/project-form/project-form';
import {AuthProvider} from './../providers/auth/auth';
import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, MenuController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from '../pages/home/home';
import {LoginPage} from './../pages/login/login';
import {TaskProvider} from '../providers/task/task';
import {LabelFormPage} from '../pages/label-form/label-form';
import {SignupPage} from '../pages/signup/signup';
import {AboutPage} from '../pages/about/about';
import {animate, state, style, transition, trigger,} from '@angular/animations';

@Component({
  templateUrl: 'app.html',
  animations: [
    trigger('openSubmenu', [
      // ...
      state('open', style({
        height: '*',
        display: 'auto'
      })),
      state('closed', style({
        height: '0',
        display: 'none'
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ]),
  ]
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any, icon?: string, rootPage: boolean, actions?: any[], pages?: any[], open?: boolean }>;
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

    this.pages = [
      {title: 'Bandeja de entrada', component: HomePage, icon: 'md-filing', rootPage: true},
      {title: 'Hoy', component: HomePage, icon: 'time', rootPage: true},
      {title: 'Este mes', component: HomePage, icon: 'calendar', rootPage: true},
      {
        title: 'Etiquetas', component: null, icon: 'bookmark', rootPage: false, actions: [
          {icon: 'construct', component: null, rootPage: false},
          {icon: 'add', component: LabelFormPage, rootPage: false},
        ], pages: [], open: true
      },
      {
        title: 'Proyectos', component: null, icon: 'folder', rootPage: false, actions: [
          {icon: 'construct', component: null, rootPage: false},
          {icon: 'add', component: ProjectFormPage, rootPage: false},
        ], pages: [], open: true
    },
      {title: 'Ajustes', component: HomePage, icon: 'settings', rootPage: true},
      {title: 'Acerca de', component: AboutPage, icon: 'information-circle', rootPage: true}
    ];
  }
  
  ngOnInit() {
    this.getUser();
    console.log('Usuario APP:', this.user);
    // Para cuando el login de google hace el redireccionamiento
    // Se comprueba que haya logeado el usuario y tenga email
    if (this.user && this.user.email && this.auth.checkLoggedIn()) {
      this.rootPage = HomePage;
    }
    this.nav.viewDidLoad.subscribe(res => {
      if (this.rootPage !== LoginPage && this.rootPage !== SignupPage) {
        this.getUser();
        this.tasksProvider.getUser();
        this.getLabels();
        this.getProjects();
      }
    });
  }

  getUser() {
    this.user = this.auth.getLoggedUser();
    console.log('Cojo los datos del usuario', this.user);
  }

  getLabels() {
    const labelsMenu = this.pages[3];
    this.tasksProvider.getLabels().subscribe(res => {
      this.labels = res;
      labelsMenu.pages = [];
      this.labels.forEach(label => {
        labelsMenu.pages.push({
          id: label.key,
          title: label.name,
          color: label.color,
          component: HomePage,
          param: label.id
        });
      });

      if (labelsMenu.pages.length <= 0) {
        labelsMenu.open = false;
      }
    });
  }

  getProjects() {
    const projectMenu = this.pages[4];
    this.tasksProvider.getProjects().subscribe(res => {
      this.projects = res;
      projectMenu.pages = [];
      this.projects.forEach(project => {
        projectMenu.pages.push({
          id: project.key,
          title: project.name,
          color: project.color,
          component: HomePage,
          param: project.id
        });
      });

      if (projectMenu.pages.length <= 0) {
        projectMenu.open = false;
      }
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
    if (component !== null) {
      this.menu.close();
      this.nav.push(component);
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

  removeSubpage(subpage: any, type: string) {
    let text;
    let mode;
    switch (type.toUpperCase()) {
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

  editSubpage(subpage: any, type: string) {
    let formPage;

    switch (type.toUpperCase()) {
      case 'ETIQUETAS':
        formPage = LabelFormPage;
        break;
      case 'PROYECTOS':
        formPage = ProjectFormPage;
        break;
    }
    this.menu.close();
    console.log(subpage, type);
    this.nav.push(formPage, {id: subpage.param});
  }
}
