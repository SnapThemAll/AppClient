import {Component} from "@angular/core";
import {LoginService} from "../../providers/login-service";
import {UserService} from "../../providers/user-service";
import {SocialSharingService} from "../../providers/social-sharing";
import {GameStorageService} from "../../providers/game-storage-service";
import {Picture} from "../../providers/game-data/picture-data";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  picturesNotUploaded: Picture[];

  constructor(
    public loginService: LoginService,
    public userService: UserService,
    public socialSharingService: SocialSharingService,
    private gameStorageService: GameStorageService,
  ) {}

  ionViewDidEnter(){
    console.log("ionViewDidEnter Settings Page");
    this.picturesNotUploaded = this.loadPicturesNotUploaded();
  }

  loadPicturesNotUploaded(): Picture[] {
    return this.gameStorageService.levels
      .map(
        (level) => level.getCards()
          .map((card) => card.getPictures()
            .filter((pic) => !pic.isUploaded())
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
