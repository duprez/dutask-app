import {Inject, Injectable} from "@angular/core";
import {SESSION_STORAGE, StorageService} from "ngx-webstorage-service";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from "firebase/app";
import {auth} from "firebase/app";
// import AuthProvider = firebase.auth.AuthProvider;
import {Observable} from "rxjs";


@Injectable()
export class AuthProvider {
  private user: firebase.User;

  constructor(
    public fireAuth: AngularFireAuth,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {}

  checkUserState() {
    return this.fireAuth.authState;
  }

  checkLoggedIn(): Observable<any> {
    return Observable.create(observer => {
      this.checkUserState().subscribe(user => {
        const email = this.storage.get("email");
        if (email && user.email === email) {
          observer.next(true);
        } else {
          observer.next(false);
        }
      });
    });
  }

  saveUserOnLocalStorage(user) {
    console.log(user);
    this.storage.set("email", user.email);
    this.storage.set("fullName", user.displayName);
    this.storage.set("photo", user.photoURL);
  }

  getLoggedUser() {
    const email = this.storage.get("email");
    const fullName = this.storage.get("fullName");
    const photo = this.storage.get("photo");
    return {
      email: email,
      fullName: fullName,
      photo: photo
    };
  }

  createUser(email: string, password: string) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => this.signInWithEmail(email, password))
      .catch(function(error) {
        console.log("Error", error);
      });
  }

  signInWithEmail(email: string, password: string) {
    return this.fireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signInWithGoogle() {
    return this.oauthSignIn(new auth.GoogleAuthProvider());
  }

  signInWithGithub() {
    return this.oauthSignIn(new auth.GithubAuthProvider());
  }

  signInWithFacebook() {
    return this.oauthSignIn(new auth.FacebookAuthProvider());
  }

  private oauthSignIn(provider) {
    return this.fireAuth.auth.signInWithPopup(provider);
    /*if ((<any>window).cordova) {
      return this.fireAuth.auth.signInWithPopup(provider);
    } else {
      return new Promise((resolve, reject) => {
        this.fireAuth.auth.signInWithRedirect(provider).then(() => {
          return this.fireAuth.auth
            .getRedirectResult()
            .then(result => {
              // This gives you a Google Access Token.
              // You can use it to access the Google API.
              const token = result.credential.providerId;
              // The signed-in user info.
              const user = result.user;
              console.log('Token', token, user);
              resolve(user);
            })
            .catch(function(error) {
              return error;
            });
        });
      });
    }*/
  }

  logout(): Observable<any> {
    return Observable.create(observer => {
      this.storage.clear();
      observer.next(true);
    });
  }
}
