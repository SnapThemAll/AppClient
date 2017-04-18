import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {Card, CardStored} from "./game-data/card-data";
import {LevelStored, Level} from "./game-data/level-data";

@Injectable()
export class GameStorageService {

  levels: Level[];

  constructor(
    private storage: Storage,
  ) {
    console.log('Hello GameService Provider');
  }


  totalScore(): number {
    return this.levels == null ? 0 : this.levels.map((lvl) => lvl.score()).reduce((left, right) => left + right);
  }

  retrieveLevels(): Promise<Level[]> {
    let env = this;
    return env.storage.get("level_ids").then((levelIDs: string[]) => {
      return Promise.all(levelIDs.map((levelID) => env.retrieveLevel(levelID)))
    }).then((levels: Level[]) => {
      env.levels = levels;
      return levels;
    }).catch((err) => {
      console.log("Error when initializing the levels: " + err);
    });
  }

  saveCard(card: Card): Promise<CardStored> {
    return this.storage.set(card.getID(), card.toCardStored())
  }

  saveLevel(level: Level): Promise<LevelStored> {
    return this.storage.set(level.getID(), level.toLevelStored());
  }

  private retrieveCard(cardID: string): Promise<Card> {
    return this.storage.get(cardID).then((cardStored: CardStored) => {
        console.log("Card " + cardID + " created");
        return Card.fromCardStored(cardStored, cardID);
      }
    ).catch((err: Error) => {
      console.log("While getting " + cardID + " this error occurred : " + err.stack);
    });
  }

  private retrieveLevel(levelID: string): Promise<Level> {
    let title, scoreToUnlock;
    let env = this;

    return env.storage.get(levelID).then((levelStored: LevelStored) => {
      title = levelStored.title;
      scoreToUnlock = levelStored.scoreToUnlock;
      return Promise.all(levelStored.cardIDs.map((cardID) => env.retrieveCard(cardID)));
    }).then((cards: Card[]) => {
      console.log("Level " + levelID + " created");
      return new Level(title, scoreToUnlock, cards, levelID);
    }).catch((err: Error) => {
      console.log("while getting " + levelID + " this error occurred: " + err);
    });
  }

}
