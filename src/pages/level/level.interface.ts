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
    let title, score, scoreToUnlock, cards;

    return storage.get(uuid).then((levelStored: LevelStored) => {
      //console.log("Level Stored : " + levelStored);
      title = levelStored.title;
      score = levelStored.score;
      scoreToUnlock = levelStored.scoreToUnlock;
      return Promise.all(levelStored.cardsUUID.map((cardUUID) => Card.fromStorage(storage, cardUUID)));
    }).then((newCards: Card[]) => {
      //console.log("Cards Stored : " + newCards);
      cards = newCards;
      let scoreTot = 0;
      for (let card of cards) {
        scoreTot += card.scores[card.bestPicture];
      }
      score = scoreTot;
      console.log("Level " + uuid + " created");
      return new Level(storage, title, score, scoreToUnlock, cards, uuid);
    }).catch((err: Error) => {
      console.log("while getting " + uuid + " this error occurred :\n" +
        "name : " + err.name + "\n" +
        "message : " + err.message + "\n" +
        "stack : " + err.stack + "\n"
      );
    });

    //return new Level(storage, title, index, score, scoreToUnlock, cards, uuid)
  }

  storeLevel(): Promise<LevelStored> {
    return this.storage.set(this.uuid, {
      title: this.title,
      score: this.score,
      scoreToUnlock: this.scoreToUnlock,
      cardsUUID: this.cards.map((card) => card.uuid),
    });
  }

  updateScore(newScore: number): Promise<LevelStored> {
    this.score = newScore;
    return this.storeLevel();
  }

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
