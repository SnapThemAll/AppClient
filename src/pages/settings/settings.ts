import {Component} from "@angular/core";
import {LoginService} from "../../providers/login-service";
import {UserService} from "../../providers/user-service";
import {SocialSharingService} from "../../providers/social-sharing";
import {GameStorageService} from "../../providers/game-storage-service";
import {ToastService} from "../../providers/toast-service";
import {ApiService, PictureData} from "../../providers/api-service";
import {Picture} from "../../providers/game-data/picture-data";
import {ModalController, Platform} from "ionic-angular";
import {TutorialPage} from "../tutorial/tutorial";
import {FeedbackPage} from "../feedback/feedback/feedback";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  picturesNotUploaded: Picture[] = [];
  picturesToDownload: PictureData[] = [];

  constructor(
    private platform: Platform,
    private loginService: LoginService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private socialSharingService: SocialSharingService,
    private gameStorageService: GameStorageService,
    private toastService: ToastService,
    private apiService: ApiService,
  ) {
    this.refreshContent();

    platform.registerBackButtonAction(() => {});
  }

  ionViewDidEnter(){
    console.log("ionViewDidEnter Settings Page");
    this.refreshContent()
  }

  displayPicturesToUpload(): string {
    let num = this.picturesNotUploaded.length;
    if(num == 0){
      return "All snaps have been uploaded";
    } else {
      return num + " snap" + (num > 1 ? "s" : "") + " have not been uploaded yet";
    }
  }

  displayPicturesToDownload(): string {
    return "You have " + (this.numPicturesOnline()) + " snap" + (this.numPicturesOnline() > 1 ? "s" : "") + " on the server"
  }

  logout(){
    this.loginService.logout();
  }

  numFriends(): number {
    if(this.userService.user != null){
      return this.userService.user.totalCount;
    } else {
      return 0
    }
  }

  numFriendsPlaying(): number {
    if(this.userService.user != null){
      return this.userService.user.friends.length - 1
    } else {
      return 0
    }
  }

  numPicturesOnline(): number {
    let numberOnDeviceUploaded =
      this.gameStorageService.game.getAllPictures().filter((pic) => pic.isUploaded()).length;
    let numberOnServer = this.picturesToDownload.length;
    return numberOnServer - numberOnDeviceUploaded;
  }

  inviteFriends() {
    this.socialSharingService.inviteFriends();
  }

  uploadPictures(){
    let env = this;
    let didAuth = false;
    env.picturesNotUploaded
      .forEach((picture) => {
        if (!picture.isUploading()) {
          env.apiService.uploadPicture(picture)
            .subscribe(
              (picture) => {
                env.gameStorageService.savePicture(picture);
                env.refreshContent();
              },
              (error) => {
                if (!didAuth) {
                  didAuth = true;
                  env.apiService.fbAuth();
                }
                picture.setUploading(false);
                console.log("Error while trying to upload a picture: " + JSON.stringify(error));
              }
            )
        }
      })
  }

  downloadPictures(){
    this.toastService.middleToast("This feature is not available yet. We're working on it.")
    // let env = this;
    // env.apiService.getPictures()
    //   .forEach((pictures) => {
    //     pictures.forEach((picture) => {
    //       env.gameStorageService.game.getLevels()[0].getCards()[0].addPicture(picture);
    //     })
    //   })
  }

  displayTutorial(){
    let modalTutorial = this.modalCtrl.create(
      TutorialPage
    );
    modalTutorial.present();
  }

  leaveFeedback(){
    let modalFeedback = this.modalCtrl.create(
      FeedbackPage
    );
    modalFeedback.present();
  }

  private refreshContent() {
    let env = this;
    env.picturesNotUploaded = env.loadPicturesNotUploaded();
    env.apiService.getPictureData()
      .subscribe((picturesData) => {
        env.picturesToDownload = picturesData;
      })
  }

  private loadPicturesNotUploaded(): Picture[] {
    return this.gameStorageService.game.getAllPictures()
      .filter((pic) => !pic.isUploaded())
  }

}
