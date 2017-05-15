import {Storage} from "@ionic/storage";
import {LevelStored} from "../game-data/level-data";
import {CardStored} from "../game-data/card-data";
import {Utils} from "../utils"

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

  cardsStored: CardStored[];
  levelsStored: LevelStored[];
  cardIDs: string[];
  levelIDs: string[];

  constructor(public levelStorageKey: string, public levelsData: LevelData[]) {
    this.levelsStored = this.toLevelsStored();
    this.levelIDs = this.levelsStored.map((levelStored) => Utils.titleToID(levelStored.title));
    this.cardsStored = this.toCardsStored();
    this.cardIDs = this.cardsStored.map((cardStored) => Utils.titleToID(cardStored.title));
  }

  storeData(storage: Storage): Promise<any> {
    let env = this;

    return Promise.all(
      [
        storage.set(env.levelStorageKey, env.levelIDs),
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
        cardIDs: levelData.cardTitles.map((title) => Utils.titleToID(title)),
      };
    });
  }

  private toCardsStored(): CardStored[] {
    return this.levelsData.map((levelData) =>
      levelData.cardTitles.map((cardTitle) => {
        let fileType = "png";
        return {
          title: cardTitle,
          illustrationURI:  "assets/img/cards/" + Utils.titleToID(cardTitle) + "." + fileType,
          pictureIDs: [],
        };
      })
    ).reduce((a, b) => a.concat(b));
  }
}
