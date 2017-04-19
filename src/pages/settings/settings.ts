import {Component} from "@angular/core";
import {LoginService} from "../../providers/login-service";
import {UserService} from "../../providers/user-service";
import {SocialSharingService} from "../../providers/social-sharing";
import {GameStorageService} from "../../providers/game-storage-service";
import {PicToUpload} from "../../providers/game-data/picture-data";
import {ApiService} from "../../providers/api-service";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  picturesNotUploaded: PicToUpload[];

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
    this.picturesNotUploaded = this.loadPicturesNotUploaded();
  }

  displayPicturesNotUploaded(): string {
    let num = this.picturesNotUploaded.length;
    if(num == 0){
      return "All snaps have been uploaded";
    } else {
      return num + " snap" + (num > 1 ? "s" : "") + " have not been uploaded yet";
    }
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
    env.picturesNotUploaded
      .map((pic) =>
        env.apiService.uploadPicture(pic)
          .subscribe(() => {
            env.refreshContent();
          })
      )
  }

  private refreshContent() {
    this.picturesNotUploaded = this.loadPicturesNotUploaded();
  }

  private loadPicturesNotUploaded(): PicToUpload[] {
    return this.gameStorageService.levels
      .map((level) => level.getCards()
        .map((card) => card.getPictures()
          .filter((pic) => !pic.isUploaded())
          .map((pic) => pic.toPictureToUpload(card))
        )
        .reduce((a, b) => a.concat(b))
      )
      .reduce((a, b) => a.concat(b))
  }

  /*
   countPicturesNotUploaded(): number {
   return this.gameStorageService.levels
   .map(
   (level) => level.getCards()
   .map((card) => card.getPictures()
   .filter((pic) => !pic.isUploaded())
   .length
   )
   .reduce((a, b) => a + b)
   )
   .reduce((a, b) => a + b)
   }
   */
}
