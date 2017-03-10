import {Card} from "../card/card.interface";
import {Storage} from "@ionic/storage";

export class Level {

  /*
   var promises = [];
   for (var i = 0; i < fileNames.length; ++i) {
   promises.push(fs.readFileAsync(fileNames[i]));
   }
   Promise.all(promises).then(function() {
   console.log("done");
   });
   */
  constructor(public storage: Storage,
              public title: string,
              public score: number,
              public scoreToUnlock: number,
              public cards: Card[],
              public uuid: string,) {
  }

  static fromStorage(storage: Storage, uuid: string): Promise<Level> {
    let title, scoreToUnlock;

    return storage.get(uuid).then((levelStored: LevelStored) => {
      title = levelStored.title;
      scoreToUnlock = levelStored.scoreToUnlock;
      return Promise.all(levelStored.cardsUUID.map((cardUUID) => Card.fromStorage(storage, cardUUID)));
    }).then((cards: Card[]) => {
      let score = cards.map((card) => card.bestScore()).reduce((a, b) => a + b);
      console.log("Level " + uuid + " created");
      return new Level(storage, title, score, scoreToUnlock, cards, uuid);
    }).catch((err: Error) => {
      console.log("while getting " + uuid + " this error occurred : " + err.stack);
    });
  }

  storeLevel(): Promise<LevelStored> {
    return this.storage.set(this.uuid, {
      title: this.title,
      scoreToUnlock: this.scoreToUnlock,
      cardsUUID: this.cards.map((card) => card.uuid),
    });
  }

  /*
  updateScore(newScore: number): Promise<LevelStored> {
    this.score = newScore;
    return this.storeLevel();
  }
   */

  isLocked(): boolean {
    return this.score < this.scoreToUnlock;
  }

  isUnlocked(): boolean {
    return !this.isLocked();
  }
}

export interface LevelStored {
  title: string,
  score: number,
  scoreToUnlock: number,
  cardsUUID: string[],
}
