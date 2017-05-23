import {Component} from "@angular/core";
import {Platform, ViewController, ModalController} from "ionic-angular";
import {FacebookService} from "../../providers/facebook-service";
import {TutorialPage} from "../tutorial/tutorial";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    private platform: Platform,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private facebookService: FacebookService,
  ) {
    platform.registerBackButtonAction(() => {})
  }


  private dismiss() {
    this.viewCtrl.dismiss();
  }

  fbLogin() {
    let env = this;
      this.facebookService.login()
        .then(() => {
          let tutorialModal = env.modalCtrl.create(
            TutorialPage
          );
          tutorialModal.present().then(() => {
            env.dismiss();
          });
        })
        .catch((error) => {
          console.log("An error occured during the facebook login:" + JSON.stringify(error));
        });
  }


}
