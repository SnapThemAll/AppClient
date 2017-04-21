import {Level} from "./level-data";
import {Card} from "./card-data";
import {Picture} from "./picture-data";

export class Game {

  constructor(
    private levels: Level[],
  ) {}

  // GETTERS
  getLevels(): Level[] { return this.levels; } //TODO should I encapsulate this ? and following
  getAllCards(): Card[] { return this.levels
    .map((level) => level.getCards())
    .reduce((cards1, cards2) => cards1.concat(cards2));
  }
  getAllPictures(): Picture[] {
    return this.getAllCards()
      .map((card) => card.getPictures())
      .reduce((pictures1, pictures2) => pictures1.concat(pictures2));
  }

  // SETTERS
  addLevel(newLevel: Level): Game {
    this.levels.push(newLevel);
    return this;
  }
  removeLevel(level: Level): Game {
    let index = this.levels.indexOf(level);
    if (index > -1) {
      this.levels.splice(index, 1);
    }
    return this;
  }

  // USEFUL FUNCTIONS
  totalScore(): number {
    return this.levels == null ? 0 : this.levels.map((lvl) => lvl.score()).reduce((left, right) => left + right);
  }

}
