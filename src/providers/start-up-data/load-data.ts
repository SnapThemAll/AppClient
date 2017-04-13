import {Storage} from "@ionic/storage";
import {LevelStored} from "../game-data/level-data";
import {CardStored} from "../game-data/card-data";

export interface LevelData {
  title: string,
  scoreToUnlock: number,
  cardTitles: string[],
}


export interface VersionStored {
  key: string,
  value: string,
}

export class Data {
  LEVELS_UUID = "levels_uuid";

  cardsStored: CardStored[];
  levelsStored: LevelStored[];
  cardsUUID: string[];
  levelsUUID: string[];

  constructor(public levelsData: LevelData[]) {
    this.levelsStored = this.toLevelsStored();
    this.levelsUUID = this.levelsStored.map((levelStored) => Data.titleToUUID(levelStored.title));
    this.cardsStored = this.toCardsStored();
    this.cardsUUID = this.cardsStored.map((cardStored) => Data.titleToUUID(cardStored.title));
  }

  storeData(storage: Storage): Promise<any> {
    let env = this;

    return Promise.all(
      [
        storage.set(env.LEVELS_UUID, env.levelsUUID),
        Promise.all(env.levelsUUID.map((levelUUID, index) => storage.set(levelUUID, env.levelsStored[index]))),
        Promise.all(env.cardsUUID.map((cardUUID, index) => storage.set(cardUUID, env.cardsStored[index]))),
      ]
    );
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
