import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {FacebookService} from "./facebook-service";
import {ModalController} from "ionic-angular";
import {LoginPage} from "../pages/login/login";
import {UserService} from "./user-service";

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoginService {

  constructor(
    private modalCtrl: ModalController,
    private facebookService: FacebookService,
    private userService: UserService,
  ) {
    console.log('Hello LoginService Provider');
  }

  login(): Promise<any>{
    return this.showLoginPage();
  }

  logout(): Promise<any> {
    let env = this;
    return env.facebookService.logout()
      .then(() => env.showLoginPage())
  }

  isLoggedIn(): boolean {
    return this.userService.user != null
  }

  private showLoginPage(): Promise<any> {
    let env = this;
    let loginModal = env.modalCtrl.create(
      LoginPage
    );
    return loginModal.present({
      animate: false,
    });
  }
}
