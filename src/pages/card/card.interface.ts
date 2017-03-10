import {Storage} from "@ionic/storage";
export class Card {

  constructor(public storage: Storage,
              public title: string,
              public picturesURI: string[],
              public scores: number[],
              public bestPicture: number,
              public uuid: string,) {
  }

  static fromStorage(storage: Storage, uuid: string): Promise<Card> {
    let title, picturesURI, scores, bestPicture;
    return storage.get(uuid).then((cardStored: CardStored) => {
      //console.log("Card Stored : " + cardStored);
      title = cardStored.title;
      picturesURI = cardStored.picturesURI;
      scores = cardStored.scores;
      bestPicture = cardStored.bestPicture;
      console.log("Card " + uuid + " created");
      return new Card(storage, title, picturesURI, scores, bestPicture, uuid);
    }).catch((err) => {
      console.log("while getting " + uuid + " this error occurred : " + err);
    })
  }
}

export interface CardStored {
  title: string,
  picturesURI: string[],
  scores: number[],
  bestPicture: number,
}
