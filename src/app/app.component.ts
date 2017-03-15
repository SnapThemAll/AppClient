import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {TabsPage} from "../pages/tabs/tabs";
import {LevelStored} from "../pages/level/level.interface";
import {CardStored} from "../pages/card/card.interface";
import {Storage} from "@ionic/storage";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor(platform: Platform, storage: Storage, http: Http) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      let dbVersion: Version = {
        key: "version",
        value: "0.0.0"
      };


      this.getVersion(dbVersion, storage).then((versionIsDifferent) => {
        if (versionIsDifferent) {
          return this.storeDataFromJson(storage, http);
        } else {
          console.log("Database up to date already");
          Promise.resolve();
        }
      }).then(() => {
        console.log("Database ready!");
        this.rootPage = TabsPage;
        StatusBar.styleDefault();
        Splashscreen.hide();
      });

    });
  }


  private getVersion(version: Version, storage: Storage): Promise<boolean> {
    return storage.get(version.key).then((versionValue) => {
      let versionIsDifferent = versionValue != version.value;
      if (versionIsDifferent) {
        storage.clear().then(() => {
          console.log("Database cleared.");
          return storage.set(version.key, version.value);
        }).then(() => {
          console.log("Database updated to version " + version.value);
        })
      }
      return versionIsDifferent;
    });
  }

  private storeDataFromJson(storage: Storage, http: Http): Promise<any> {
    console.log("Setting up database on first start...");
    return http.get("assets/levels.json")
      .map(res => res.json())
      .map((levelsData) => {
        let data = new Data(levelsData);
        return data.storeData(storage);
      })
      .toPromise();
  }
}

interface LevelData {
  title: string,
  scoreToUnlock: 0,
  cardTitles: string[],
}


interface Version {
  key: string,
  value: string,
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
        let fileType = "png";
        return {
          title: cardTitle,
          picturesURI: ["assets/cards/" + fileType + "/" + this.titleToUUID(cardTitle) + "." + fileType],
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
