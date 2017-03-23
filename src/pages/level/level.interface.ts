import {Card} from "../card/card.interface";
import {Storage} from "@ionic/storage";

export class Level {

  constructor(private storage: Storage,
              private title: string,
              private scoreToUnlock: number,
              private cards: Card[],
              private uuid: string,) {
  }

  static fromStorage(storage: Storage, uuid: string): Promise<Level> {
    let title, scoreToUnlock;

    return storage.get(uuid).then((levelStored: LevelStored) => {
      title = levelStored.title;
      scoreToUnlock = levelStored.scoreToUnlock;
      return Promise.all(levelStored.cardsUUID.map((cardUUID) => Card.fromStorage(storage, cardUUID)));
    }).then((cards: Card[]) => {
      console.log("Level " + uuid + " created");
      return new Level(storage, title, scoreToUnlock, cards, uuid);
    }).catch((err: Error) => {
      console.log("while getting " + uuid + " this error occurred : " + err.stack);
    });
  }

  getTitle(): string {
    return this.title;
  }

  getScoreToUnlock(): number {
    return this.scoreToUnlock;
  }

  getCards(): Card[] {
    return this.cards;
  }

  getUUID(): string {
    return this.uuid;
  }

  isLocked(totalScore: number): boolean {
    return totalScore < this.scoreToUnlock;
  }

  isUnlocked(totalScore: number): boolean {
    return !this.isLocked(totalScore);
  }

  score(): number {
    return Math.round(this.cards.map((card) => card.bestScore()).reduce((a, b) => a + b) * 100) / 100;
  }

  storeLevel(): Promise<LevelStored> {
    return this.storage.set(this.uuid, {
      title: this.title,
      scoreToUnlock: this.scoreToUnlock,
      cardsUUID: this.cards.map((card) => card.getUUID()),
    });
  }
}

export interface LevelStored {
  title: string,
  scoreToUnlock: number,
  cardsUUID: string[],
}
