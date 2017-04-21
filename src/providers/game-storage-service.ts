import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {Card, CardStored} from "./game-data/card-data";
import {LevelStored, Level} from "./game-data/level-data";
import {Picture, PictureStored} from "./game-data/picture-data";
import {Game} from "./game-data/game-data";
import {FileManager} from "./file-manager"

@Injectable()
export class GameStorageService {

  game: Game;

  constructor(
    private storage: Storage,
    private fileManager: FileManager,
  ) {
    console.log('Hello GameService Provider');
  }

  savePicture(picture: Picture): Promise<PictureStored> {
    return this.storage.set(picture.getID(), picture.toPictureStored());
  }
  saveCard(card: Card): Promise<CardStored> {
    return this.storage.set(card.getID(), card.toCardStored())
  }
  saveLevel(level: Level): Promise<LevelStored> {
    return this.storage.set(level.getID(), level.toLevelStored());
  }

  saveGame(): Promise<any> {
    let levels: Level[] = this.game.getLevels();
    let cards: Card[] = this.game.getAllCards();
    let pictures: Picture[] = cards.map((card) => card.getPictures()).reduce((pictures1, pictures2) => pictures1.concat(pictures2));

    return Promise.all([
      Promise.all(levels.map((level) => this.saveLevel(level))),
      Promise.all(cards.map((card) => this.saveCard(card))),
      Promise.all(pictures.map((pic) => this.savePicture(pic))),
    ]);
  }


  loadGame(): Promise<Game> {
    let env = this;
    return env.storage.get("level_ids")
      .then((levelIDs: string[]) => {
        return Promise.all(levelIDs.map((levelID) => env.retrieveLevel(levelID)))
      })
      .then((levels: Level[]) => {
        let game = new Game(levels);
        env.game = game;
        return game;
      })
      .catch((error) => {
        console.log("Error when initializing the levels: " + JSON.stringify(error));
      });
  }


  private retrievePicture(pictureID: string): Promise<Picture> {
    let env = this;
    return env.storage.get(pictureID)
      .then((pictureStored: PictureStored) => {
        console.log("Picture " + pictureID + " created");
        return new Picture(
          pictureStored.fileName,
          pictureStored.cardID,
          env.fileManager.dataDir() + pictureStored.cardID + "/" + pictureStored.fileName,
          pictureStored.score,
          pictureStored.uploaded,
        );
      })
      .catch((error) => {
        console.log("While getting " + pictureID + " this error occurred : " + JSON.stringify(error));
      });
  }

  private retrieveCard(cardID: string): Promise<Card> {
    let env = this,
      title: string,
      illustrationURI: string;

    return env.storage.get(cardID)
      .then((cardStored: CardStored) => {
        title = cardStored.title;
        illustrationURI = cardStored.illustrationURI;
        return Promise.all(cardStored.pictureIDs.map((picID) => env.retrievePicture(picID)));
      })
      .then((pictures: Picture[]) => {
          console.log("Card " + cardID + " created");
          return new Card(title, illustrationURI, pictures);
        }
      )
      .catch((error) => {
        console.log("While getting " + cardID + " this error occurred : " + JSON.stringify(error));
      });
  }

  private retrieveLevel(levelID: string): Promise<Level> {
    let env = this,
      title: string,
      scoreToUnlock: number;

    return env.storage.get(levelID)
      .then((levelStored: LevelStored) => {
        title = levelStored.title;
        scoreToUnlock = levelStored.scoreToUnlock;
        return Promise.all(levelStored.cardIDs.map((cardID) => env.retrieveCard(cardID)));
      })
      .then((cards: Card[]) => {
        console.log("Level " + levelID + " created");
        return new Level(title, scoreToUnlock, cards);
      })
      .catch((error) => {
        console.log("while getting " + levelID + " this error occurred: " + JSON.stringify(error));
      });
  }

}
