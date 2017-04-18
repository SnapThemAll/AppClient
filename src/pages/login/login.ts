import {Component} from "@angular/core";
import {Platform, ViewController} from "ionic-angular";
import {FacebookService} from "../../providers/facebook-service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public platform: Platform,
    public viewCtrl: ViewController,
    public facebookService: FacebookService,
  ) {
    platform.registerBackButtonAction(() => {}, 1)
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  fbLogin() {
    let env = this;
    this.facebookService.login().then(() => {
      env.dismiss();
    });
  }


}
