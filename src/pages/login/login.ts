import {Component} from "@angular/core";
import {Platform, ViewController, ModalController} from "ionic-angular";
import {FacebookService} from "../../providers/facebook-service";
import {TutorialPage} from "../tutorial/tutorial";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  browserTestingMode = true;

  constructor(
    private platform: Platform,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private facebookService: FacebookService,
  ) {
    platform.registerBackButtonAction(() => {}, 1)
  }


  private dismiss() {
    this.viewCtrl.dismiss();
  }

  fbLogin() {
    let env = this;
    if(env.browserTestingMode){
      //env.dismiss();
      let tutorialModal = env.modalCtrl.create({
        TutorialPage
      });
      tutorialModal.present()
    } else {
      this.facebookService.login()
        .then(() => {
          env.dismiss();
          let tutorialModal = env.modalCtrl.create({
            TutorialPage
          });
          tutorialModal.present()
        })
        .catch((error) => {
          console.log("An error occured during the facebook login:" + JSON.stringify(error));
        });
    }
  }


}
