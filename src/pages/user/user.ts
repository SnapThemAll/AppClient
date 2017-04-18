import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {User} from "../../providers/user-data/user-data";
import {ApiService} from "../../providers/api-service";
import {UserService} from "../../providers/user-service";
import {FacebookService} from "../../providers/facebook-service";

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})

export class UserPage {

  user: User;

  constructor(
    private navCtrl: NavController,
    private facebookService: FacebookService,
    private apiService: ApiService,
    private userService: UserService,
  ) {
  }

  ionViewDidEnter() {
    this.user = this.userService.user
  }

  isLoggedIn(): boolean {
    return this.user != null;
  }

  login() {
    let env = this;
    env.facebookService.login().then(() => {
      env.user = env.userService.user;
    })
  }
  logout() {
    let env = this;
    env.facebookService.logout().then(() => {
      env.user = env.userService.user;
    })
  }

  auth(){
    this.apiService.alertResponseTextAndHeaders(this.apiService.fbAuth());
  }
}
