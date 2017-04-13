import {Component} from "@angular/core";
import {Platform, ViewController} from "ionic-angular";
import {FacebookLoginService} from "../../providers/facebook-login-service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {



  constructor(
    public platform: Platform,
    public viewCtrl: ViewController,
    public facebookLoginService: FacebookLoginService,
  ) {
    platform.registerBackButtonAction(() => {}, 1)
  }


  dismiss() {

    this.viewCtrl.dismiss();
  }

  fbLogin() {
    let env = this;
    this.facebookLoginService.login().then(() => {
      env.dismiss();
    });
  }


}
