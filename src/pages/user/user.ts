import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {User} from "../../providers/user-data/user-data";
import {CardService} from "../../providers/card-service";
import {UserService} from "../../providers/user-service";
import {FacebookLoginService} from "../../providers/facebook-login-service";

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})

export class UserPage {

  user: User;

  constructor(
    public navCtrl: NavController,
    public facebookLoginService: FacebookLoginService,
    public cardService: CardService,
    public userService: UserService,
  ) {
    this.user = userService.user
  }

  ionViewDidLoad() {
    this.retrieveUser();
  }

  retrieveUser() {
    let env = this;
    this.userService.fetch()
      .then((user) => {
        env.user = user;
      })
  }

  isLoggedIn(): boolean {
    return this.user != null;
  }

  login() {
    let env = this;
    env.facebookLoginService.login().then(() => {
      env.user = env.userService.user;
    })
  }
  logout() {
    let env = this;
    env.facebookLoginService.logout().then(() => {
      env.user = env.userService.user;
    })
  }

  auth(){
    this.cardService.alertResponseTextAndHeaders(this.cardService.authenticate("facebook", this.user.authToken));
  }
}
