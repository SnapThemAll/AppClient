import {Component} from "@angular/core";
import {Platform, ViewController, ModalController} from "ionic-angular";
import {FacebookService} from "../../providers/facebook-service";
import {TutorialPage} from "../tutorial/tutorial";
import {ApiService} from "../../providers/api-service";
import {UserService} from "../../providers/user-service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    private platform: Platform,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private userService: UserService,
    private facebookService: FacebookService,
    private apiService: ApiService,
  ) {
    platform.registerBackButtonAction(() => {})
  }


  private dismiss() {
    this.viewCtrl.dismiss();
  }

  fbLogin() {
    let env = this;
      this.facebookService.login()
        .then((user) => {
          let tutorialModal = env.modalCtrl.create(
            TutorialPage
          );
          tutorialModal.present().then(() => {
            env.dismiss();
          });
          return env.userService.saveUser(user);
        })
        .then(() => env.apiService.fbAuth(env.userService.user.authToken))
        .then(() => env.userService.updatePlayers())
        .catch((error) => {
          console.log("An error occured during the facebook login:" + JSON.stringify(error));
        });
  }


}
