import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import 'rxjs/add/operator/map';
import {Level, LevelStored} from "./game-data/level-data";
import {Card} from "./game-data/card-data";

/*
  Generated class for the LevelsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LevelsService {

  levels: Level[];

  constructor(
    private storage: Storage,
  ) {
    console.log('Hello LevelsService Provider');
  }

  loadLevels(): Promise<Level[]> {
    let env = this;
    return env.storage.get("levels_uuid").then((uuids: string[]) => {
      return Promise.all(uuids.map((uuid) => env.loadLevel(uuid)))
    }).then((levels: Level[]) => {
      env.levels = levels;
      return levels;
    }).catch((err) => {
      console.log("Error when initializing the levels: " + err);
    });
  }

  loadLevel(uuid: string): Promise<Level> {
    let title, scoreToUnlock;
    let env = this;

    return env.storage.get(uuid).then((levelStored: LevelStored) => {
      title = levelStored.title;
      scoreToUnlock = levelStored.scoreToUnlock;
      return Promise.all(levelStored.cardsUUID.map((cardUUID) => Card.fromStorage(env.storage, cardUUID)));
    }).then((cards: Card[]) => {
      console.log("Level " + uuid + " created");
      return new Level(env.storage, title, scoreToUnlock, cards, uuid);
    }).catch((err: Error) => {
      console.log("while getting " + uuid + " this error occurred: " + err);
    });
  }

}
