import {Card} from "./card-data";

export class Level {

  constructor(
    private title: string,
    private scoreToUnlock: number,
    private cards: Card[],
    private id: string,) {
  }

  // GETTERS
  getTitle(): string { return this.title; }
  getScoreToUnlock(): number { return this.scoreToUnlock; }
  getCards(): Card[] { return this.cards; } //TODO should I encapsulate this ?
  getID(): string { return this.id; }

  // USEFUL FUNCTIONS
  isLocked(totalScore: number): boolean {
    return totalScore < this.scoreToUnlock;
  }

  isUnlocked(totalScore: number): boolean {
    return !this.isLocked(totalScore);
  }

  score(): number {
    return Math.round(this.cards.map((card) => card.bestScore()).reduce((a, b) => a + b) * 100) / 100;
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
