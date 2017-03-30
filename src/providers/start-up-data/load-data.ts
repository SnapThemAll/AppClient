import {Storage} from "@ionic/storage";
import {Http} from "@angular/http";
import { LevelStored } from "../game-data/level-data";
import { CardStored } from "../game-data/card-data";

export interface LevelData {
  title: string,
  scoreToUnlock: 0,
  cardTitles: string[],
}


export interface Version {
  key: string,
  value: string,
}

export class Data {
  LEVELS_UUID = "levels_uuid";

  constructor(public levelsData: LevelData[]) {
  }

  storeData(storage: Storage): Promise<any> {
    let levelsStored = this.toLevelsStored();
    let levelsUUID: string[] = levelsStored.map((levelStored) => Data.titleToUUID(levelStored.title));
    let cardsStored = this.toCardsStored();
    let cardsUUID: string[] = cardsStored.map((cardStored) => Data.titleToUUID(cardStored.title));

    return Promise.all(
      [
        storage.set(this.LEVELS_UUID, levelsUUID),
        Promise.all(levelsUUID.map((levelUUID, index) => storage.set(levelUUID, levelsStored[index]))),
        Promise.all(cardsUUID.map((cardUUID, index) => storage.set(cardUUID, cardsStored[index]))),
      ]
    );
  }


  static getVersion(version: Version, storage: Storage): Promise<boolean> {
    return storage.get(version.key).then((versionValue) => {
      let versionIsDifferent = versionValue != version.value;
      let promise = Promise.resolve(versionIsDifferent);
      if (versionIsDifferent) {
        promise = storage.clear().then(() => {
          console.log("Database cleared.");
          return storage.set(version.key, version.value);
        }).then(() => {
          console.log("Database updated to version " + version.value);
          return versionIsDifferent;
        })
      } else {
        console.log("Database up to date already (v." + versionValue + ")");
      }
      return promise;
    });
  }

  static storeDataFromJson(storage: Storage, http: Http): Promise<any> {
    console.log("Setting up database...");
    return http.get("assets/levels.json")
      .map(res => res.json())
      .map((levelsData) => {
        let data = new Data(levelsData);
        return data.storeData(storage);
      })
      .toPromise();
  }

  private toLevelsStored(): LevelStored[] {
    return this.levelsData.map((levelData) => {
      return {
        title: levelData.title,
        scoreToUnlock: levelData.scoreToUnlock,
        cardsUUID: levelData.cardTitles.map((title) => Data.titleToUUID(title)),
      };
    });
  }

  private toCardsStored(): CardStored[] {
    return this.levelsData.map((levelData) =>
      levelData.cardTitles.map((cardTitle) => {
        let fileType = "png";
        return {
          title: cardTitle,
          picturesURI: ["assets/cards/" + fileType + "/" + Data.titleToUUID(cardTitle) + "." + fileType],
          scores: [0],
          bestPicture: 0,
        };
      })
    ).reduce((a, b) => a.concat(b));
  }

  private static titleToUUID(title: String): string {
    return title.replace(/ +/g, "_").toLocaleLowerCase();
  }
}
