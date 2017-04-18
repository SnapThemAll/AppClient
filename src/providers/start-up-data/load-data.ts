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
  LEVEL_IDS = "level_ids";

  cardsStored: CardStored[];
  levelsStored: LevelStored[];
  cardIDs: string[];
  levelIDs: string[];

  constructor(public levelsData: LevelData[]) {
    this.levelsStored = this.toLevelsStored();
    this.levelIDs = this.levelsStored.map((levelStored) => Data.titleToID(levelStored.title));
    this.cardsStored = this.toCardsStored();
    this.cardIDs = this.cardsStored.map((cardStored) => Data.titleToID(cardStored.title));
  }

  storeData(storage: Storage): Promise<any> {
    let env = this;

    return Promise.all(
      [
        storage.set(env.LEVEL_IDS, env.levelIDs),
        Promise.all(env.levelIDs.map((levelID, index) => storage.set(levelID, env.levelsStored[index]))),
        Promise.all(env.cardIDs.map((cardID, index) => storage.set(cardID, env.cardsStored[index]))),
      ]
    );
  }

  private toLevelsStored(): LevelStored[] {
    return this.levelsData.map((levelData) => {
      return {
        title: levelData.title,
        scoreToUnlock: levelData.scoreToUnlock,
        cardIDs: levelData.cardTitles.map((title) => Data.titleToID(title)),
      };
    });
  }

  private toCardsStored(): CardStored[] {
    return this.levelsData.map((levelData) =>
      levelData.cardTitles.map((cardTitle) => {
        let fileType = "png";
        return {
          title: cardTitle,
          illustrationURI:  "assets/cards/" + fileType + "/" + Data.titleToID(cardTitle) + "." + fileType,
          pictures: [],
        };
      })
    ).reduce((a, b) => a.concat(b));
  }

  private static titleToID(title: String): string {
    return title.replace(/ +/g, "_").toLocaleLowerCase();
  }
}
