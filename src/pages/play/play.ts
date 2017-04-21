import {Component} from "@angular/core";
import {NavController, ToastController} from "ionic-angular";
import {LevelPage} from "../level/level";
import {Level} from "../../providers/game-data/level-data";
import {LoginService} from "../../providers/login-service";
import {ApiService} from "../../providers/api-service";
import {GameStorageService} from "../../providers/game-storage-service";

@Component({
  selector: 'page-play',
  templateUrl: 'play.html',
})

export class PlayPage {

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loginService: LoginService,
    private apiService: ApiService,
    private gameStorageService: GameStorageService,
  ) {
    if(!this.loginService.isLoggedIn()){
      this.loginService.login();
    } else {
      apiService.fbAuth();
    }
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

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  itemSelected(level: Level) {
    if (level.isUnlocked(this.score())) {
      this.navCtrl.push(LevelPage, {
        level: level
      })
    } else {
      this.presentToast("You need " + (level.getScoreToUnlock() - this.score()).toFixed(2) + " more points to unlock!")
    }
  }
}
