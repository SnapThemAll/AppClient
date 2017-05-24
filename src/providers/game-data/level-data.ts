import {Card} from "./card-data";
import {Utils} from "../utils";

export class Level {

  constructor(
    private title: string,
    private scoreToUnlock: number,
    private cards: Card[],
  ) {}

  // GETTERS
  getTitle(): string { return this.title; }
  getScoreToUnlock(): number { return this.scoreToUnlock; }
  getCards(): Card[] { return this.cards; } //TODO should I encapsulate this ?
  getID(): string { return Utils.titleToID(this.title); }

  // USEFUL FUNCTIONS
  isLocked(totalScore: number): boolean {
    return totalScore < this.scoreToUnlock;
  }

  isUnlocked(totalScore: number): boolean {
    return !this.isLocked(totalScore);
  }

  score(): number {
    return Math.round(this.cards.map((card) => card.totalScore()).reduce((a, b) => a + b) * 100) / 100;
  }

  // EXPORT
  toLevelStored(): LevelStored {
    return {
      title: this.title,
      scoreToUnlock: this.scoreToUnlock,
      cardIDs: this.cards.map((card) => card.getID()),
    };
  }
}

export interface LevelStored {
  title: string,
  scoreToUnlock: number,
  cardIDs: string[],
}
