import {Component} from "@angular/core";
import {ModalController, NavController} from "ionic-angular";
import {LevelPage} from "../level/level";
import {Level} from "../../providers/game-data/level-data";
import {LoginPage} from "../login/login";
import {FacebookLoginService} from "../../providers/facebook-login-service";
import {LevelsService} from "../../providers/levels-service";

@Component({
  selector: 'page-play',
  templateUrl: 'play.html',
})

export class PlayPage {
  levels: Level[];

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private facebookLoginService: FacebookLoginService,
    private levelsService: LevelsService,
  ) {
    this.levels = this.levelsService.levels;
  }

  ionViewDidEnter(){
    if(!this.facebookLoginService.isLoggedIn()){
      this.showLoginPage();
    }
  }

  totalScore(): number {
    return this.levels == null ? 0 : this.levels.map((lvl) => lvl.score()).reduce((left, right) => left + right);
  }

  itemSelected(level: Level) {
    if (level.isUnlocked(this.totalScore())) {
      this.navCtrl.push(LevelPage, {
        level: level
      })
    }
  }

  showLoginPage() {
    let env = this;
    let loginModal = env.modalCtrl.create(
      LoginPage
    );
    loginModal.present({
      animate: false,
    });
  }
}
