import {Component} from "@angular/core";
import {NavController, Platform} from "ionic-angular";
import {LevelPage} from "../level/level";
import {Level} from "../../providers/game-data/level-data";
import {LoginService} from "../../providers/login-service";
import {ApiService} from "../../providers/api-service";
import {GameStorageService} from "../../providers/game-storage-service";
import {ToastService} from "../../providers/toast-service";
import {UserService} from "../../providers/user-service";

@Component({
  selector: 'page-play',
  templateUrl: 'play.html',
})

export class PlayPage {

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private loginService: LoginService,
    private apiService: ApiService,
    private userService: UserService,
    private gameStorageService: GameStorageService,
    private toastService: ToastService,
  ) {

    if(!loginService.isLoggedIn()){
      loginService.login();
    } else {
      apiService.fbAuth(this.userService.user.authToken);
    }

    platform.registerBackButtonAction(() => {});
  }

  ionViewWillLeave(){
    this.toastService.dismissAll();
  }

  ionViewDidEnter(){
    console.log("ionViewDidEnter Play Page");
  }

  levels(): Level[] {
    return this.gameStorageService.game.getLevels();
  }

  score(): number {
    return this.gameStorageService.game.totalScore();
  }

  itemSelected(level: Level) {
    if (level.isUnlocked(this.score())) {
      this.navCtrl.push(LevelPage, {
        level: level
      })
    } else {
      this.toastService.middleToast("You need " + (level.getScoreToUnlock() - this.score()).toFixed(2) + " more points to unlock!")
    }
  }
}
