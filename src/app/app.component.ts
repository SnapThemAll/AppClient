import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {TabsPage} from "../pages/tabs/tabs";
import {LevelStored} from "../pages/level/level.interface";
import {CardStored} from "../pages/card/card.interface";
import {Storage} from "@ionic/storage";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor(platform: Platform, storage: Storage, http: Http) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      let FIRST_START = "first_start_0";

      Observable.fromPromise(storage.get(FIRST_START)).flatMap((value) => {
        if (value == null) {
          return this.storeDataFromJson(FIRST_START, storage, http);
        } else {
          return Observable.range(0, 1);
        }
      }).subscribe(() => {
        console.log("Database ready!");
        this.rootPage = TabsPage;
        StatusBar.styleDefault();
        Splashscreen.hide();
      })
    });
  }

  private storeDataFromJson(firstStart: string, storage: Storage, http: Http): Observable<any> {
    console.log("Setting up database on first start...");
    return http.get("assets/lvl/levels.json")
      .map(res => res.json())
      .flatMap((levelsData) => {
        let data = new Data(levelsData);
        storage.set(firstStart, false);
        return data.storeData(storage);
      })
  }
}

interface LevelData {
  title: string,
  scoreToUnlock: 0,
  cardTitles: string[],
}

class Data {
  LEVELS_UUID = "levels_uuid";

  constructor(public levelsData: LevelData[]) {
  }

  storeData(storage: Storage): Promise<any> {
    let levelsStored = this.toLevelsStored();
    let levelsUUID: string[] = levelsStored.map((levelStored) => this.titleToUUID(levelStored.title));
    let cardsStored = this.toCardsStored();
    let cardsUUID: string[] = cardsStored.map((cardStored) => this.titleToUUID(cardStored.title));

    return Promise.all(
      [
        storage.set(this.LEVELS_UUID, levelsUUID),
        Promise.all(levelsUUID.map((levelUUID, index) => storage.set(levelUUID, levelsStored[index]))),
        Promise.all(cardsUUID.map((cardUUID, index) => storage.set(cardUUID, cardsStored[index]))),
      ]
    );
  }

  private toLevelsStored(): LevelStored[] {
    return this.levelsData.map((levelData) => {
      return {
        title: levelData.title,
        scoreToUnlock: levelData.scoreToUnlock,
        cardsUUID: levelData.cardTitles.map((title) => this.titleToUUID(title)),
      };
    });
  }

  private toCardsStored(): CardStored[] {
    return this.levelsData.map((levelData) =>
      levelData.cardTitles.map((cardTitle) => {
        return {
          title: cardTitle,
          picturesURI: ["assets/img/cards/" + this.titleToUUID(cardTitle) + ".jpg"],
          scores: [0],
          bestPicture: 0,
        };
      })
    ).reduce((a, b) => a.concat(b));
  }

  private titleToUUID(title: String): string {
    return title.replace(/ +/g, "_").toLocaleLowerCase();
  }
}
