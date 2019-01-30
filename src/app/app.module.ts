import { AboutPageModule } from '../pages/about/about.module';
import { ProjectFormPageModule } from './../pages/project-form/project-form.module';
import { LabelFormPageModule } from './../pages/label-form/label-form.module';
import { TaskPageModule } from './../pages/task/task.module';
import { SignupPageModule } from './../pages/signup/signup.module';
import { LoginPageModule } from './../pages/login/login.module';
import { AngularFirestore } from 'angularfire2/firestore';
import { ComponentsModule } from './../components/components.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TaskProvider } from '../providers/task/task';

// LOCAL STORAGE
import { StorageServiceModule } from 'ngx-webstorage-service';

// FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth/auth';

const config = {
  apiKey: "AIzaSyDFKY8hq5jVUD5v2buMgXms7NbtsQuCyx0",
  authDomain: "do-dutask.firebaseapp.com",
  databaseURL: "https://do-dutask.firebaseio.com",
  projectId: "do-dutask",
  storageBucket: "do-dutask.appspot.com",
  messagingSenderId: "393206743045"
};

// CALENDARIO
import { CalendarModule } from "ion2-calendar";
import { registerLocaleData } from '@angular/common';
import esEs from '@angular/common/locales/es';
registerLocaleData(esEs);


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    ComponentsModule,
    LoginPageModule,
    SignupPageModule,
    TaskPageModule,
    LabelFormPageModule,
    ProjectFormPageModule,
    StorageServiceModule,
    CalendarModule,
    AboutPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "es-ES" },
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TaskProvider,
    AngularFirestore,
    AngularFireAuth,
    AuthProvider
  ]
})
export class AppModule {}
