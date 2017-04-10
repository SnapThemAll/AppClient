import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {User} from "../../providers/user-data/user-data";
import {CardService} from "../../providers/card-service";
import {UserService} from "../../providers/user-service";
import {FacebookLoginService} from "../../providers/facebook-login-service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
  providers: [
    FacebookLoginService,
    CardService,
    UserService,
  ],
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

  auth2(){
    this.cardService.alertResponseTextAndHeaders(this.cardService.http.get("http://localhost:8100/api/authenticate/token/facebook?access_token=EAADFFfxbA6gBACtkMjPmE2DGrqQlVwtYsokbJMiMitb1WqkKMe8kfxMRutVglsksF7nX5Fvr0Fuxclj5EjJ6Gb8R6xdu3C97uh7ODUyEz1D5m5B2n6iPFM5FtPSejUAeJodeEMhgKstxppvUIZB60QCy26bb4JZBrsY9wTogwctysBhhJCZC2vn0I06kzFqPBnd0W1HxR9PhACXm5d1"));
  }

  uploadPic(){
    this.cardService.alertResponseTextAndHeaders(this.cardService.apiPost("/uploadpic/cardNameXx", new FormData()));
  }

  uploadPic2(){
    this.cardService.alertResponseTextAndHeaders(this.cardService.http.post("http://localhost:8100/api/uploadpic/cardNameXx", new FormData()));
  }

}
