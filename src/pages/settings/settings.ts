import {Component} from "@angular/core";
import {LoginService} from "../../providers/login-service";
import {UserService} from "../../providers/user-service";
import {SocialSharingService} from "../../providers/social-sharing";
import {ToastService} from "../../providers/toast-service";
import {ModalController, Platform} from "ionic-angular";
import {TutorialPage} from "../tutorial/tutorial";
import {FeedbackPage} from "../feedback/feedback/feedback";
import {UpdateService} from "../../providers/update-service";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  numberOfPicturesToUpload: number = 0;
  numberOfPicturesToDownload: number = 0;
  numberOfFriends: number = 0;
  numberOfFriendsPlaying: number = 0;

  constructor(
    private platform: Platform,
    private loginService: LoginService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private socialSharingService: SocialSharingService,
    private toastService: ToastService,
    private updateService: UpdateService,
  ) {

    let env = this;
    if(this.platform.is("cordova")){
      env.numberOfFriends = env.userService.user.totalCount;
      env.numberOfFriendsPlaying = env.userService.user.friends.length;
      env.numberOfPicturesToUpload = env.updateService.picturesToUpload.length;
      env.numberOfPicturesToDownload = env.updateService.picturesToDownload.length;
    }

    platform.registerBackButtonAction(() => {});
  }

  ionViewWillLeave(){
    this.toastService.dismissAll();
  }

  ionViewDidEnter(){
    console.log("ionViewDidEnter Settings Page");
    this.load();
  }

  load() {
    let env = this;

    if( env.platform.is("cordova") ){
      console.log("updating SettingsPage content");
      env.numberOfFriends = env.userService.user.totalCount;
      env.numberOfFriendsPlaying = env.userService.user.friends.length;
      env.updateService.refresh()
        .then(() => {
          env.numberOfPicturesToDownload = env.updateService.picturesToDownload.length;
        });
      env.numberOfPicturesToUpload = env.updateService.picturesToUpload.length;
    }
  }

  displayPicturesToUpload(): string {
    let num = this.numberOfPicturesToUpload;
    if(num == 0){
      return "All snaps have been uploaded";
    } else {
      return num + " snap" + (num > 1 ? "s have" : " has") + " not been uploaded yet";
    }
  }

  displayPicturesToDownload(): string {
    let num = this.numberOfPicturesToDownload;
    return "You have " + num + " snap" + (num > 1 ? "s" : "") + " on the server"
  }

  logoutButton(){
    this.loginService.logout();
  }

  inviteButton() {
    this.socialSharingService.inviteFriends();
  }

  uploadButton(){
    let env = this;
    env.updateService.uploadAllPictures()
      .forEach((promise) => promise.then(() => {
        env.numberOfPicturesToUpload = env.updateService.picturesToUpload.length
      }));
  }

  downloadButton(){
    this.toastService.middleToast("This feature is not available yet. We're working on it.")
    // let env = this;
    // env.apiService.getPictures()
    //   .forEach((pictures) => {
    //     pictures.forEach((picture) => {
    //       env.gameStorageService.game.getLevels()[0].getCards()[0].addPicture(picture);
    //     })
    //   })
  }

  helpButton(){
    let modalTutorial = this.modalCtrl.create(
      TutorialPage
    );
    modalTutorial.present();
  }

  feedbackButton(){
    let modalFeedback = this.modalCtrl.create(
      FeedbackPage
    );
    modalFeedback.present();
  }

}
