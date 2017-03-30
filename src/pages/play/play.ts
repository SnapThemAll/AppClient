import {Component} from "@angular/core";
import {Storage} from "@ionic/storage";
import {NavController} from "ionic-angular";
import {LevelPage} from "../level/level";
import {Level} from "../../providers/game-data/level-data";

@Component({
  selector: 'page-play',
  templateUrl: 'play.html',
})

export class PlayPage {
  levels: Level[];

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
  ) {
  }

  ionViewCanEnter(){
    return this.initLevels();
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

  private initLevels(): Promise<boolean> {
    return this.storage.get("levels_uuid").then((uuids: string[]) => {
      return Promise.all(uuids.map((uuid) => Level.fromStorage(this.storage, uuid)))
    }).then((levels: Level[]) => {
      this.levels = levels;
      return true;
    }).catch((err) => {
      console.log("Error when initializing the levels:" + err);
    });
  }
}
