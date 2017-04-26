import {Component} from "@angular/core";
import {LoginService} from "../../providers/login-service";
import {UserService} from "../../providers/user-service";
import {SocialSharingService} from "../../providers/social-sharing";
import {GameStorageService} from "../../providers/game-storage-service";
import {ApiService} from "../../providers/api-service";
import {Picture} from "../../providers/game-data/picture-data";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  picturesNotUploaded: Picture[];

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private socialSharingService: SocialSharingService,
    private gameStorageService: GameStorageService,
    private apiService: ApiService,
  ) {
    this.refreshContent()
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
    return "Hello"
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
      return this.userService.user.friends.length
    } else {
      return 0
    }
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
    let env = this;
    env.apiService.getPictures()
      .forEach((pictures) => {
        pictures.forEach((picture) => {
          env.gameStorageService.game.getLevels()[0].getCards()[0].addPicture(picture);
        })
      })
  }

  private refreshContent() {
    this.picturesNotUploaded = this.loadPicturesNotUploaded();
  }

  private loadPicturesNotUploaded(): Picture[] {
    return this.gameStorageService.game.getAllPictures()
      .filter((pic) => !pic.isUploaded())
  }

}
