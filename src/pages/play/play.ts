import {Component} from "@angular/core";
import {Storage} from "@ionic/storage";
import {NavController} from "ionic-angular";
import {LevelPage} from "../level/level";
import {Level} from "../level/level.interface";

@Component({
  selector: 'page-play',
  templateUrl: 'play.html',
})

export class PlayPage {
  levels: Level[];

  constructor(public navCtrl: NavController,
              public storage: Storage,) {
    this.initLevels();
  }

  private initLevels(): void {
    this.storage.get("levelsUUID").then((uuids: string[]) => {
      return Promise.all(uuids.map((uuid) => Level.fromStorage(this.storage, uuid)))
    }).then((levels: Level[]) => {
      this.levels = levels;
    }).catch((err: Error) => {
      console.log("while assigning levels this error occurred :\n" +
        "name : " + err.name + "\n" +
        "message : " + err.message + "\n" +
        "stack : " + err.stack + "\n"
      );
    });
  }

  totalScore(): number {
    return this.levels.map((lvl) => lvl.score).reduce((left, right) => left + right);
  }

  itemSelected(level: Level) {
    if (level.isUnlocked()) {
      this.navCtrl.push(LevelPage, {
        level: level
      })
    }
  }

}
