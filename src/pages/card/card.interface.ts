import {Storage} from "@ionic/storage";
export class Card {

  constructor(private storage: Storage,
              public title: string,
              public picturesURI: string[],
              public scores: number[],
              public bestPictureIndex: number,
              public uuid: string,) {
  }

  static fromStorage(storage: Storage, uuid: string): Promise<Card> {
    let title: string, picturesURI: string[], scores: number[], bestPicture: number;

    return storage.get(uuid).then((cardStored: CardStored) => {

        title = cardStored.title;
        picturesURI = cardStored.picturesURI;
        scores = cardStored.scores;
        bestPicture = cardStored.bestPicture;

        console.log("Card " + uuid + " created");
        return new Card(storage, title, picturesURI, scores, bestPicture, uuid);
      }
    ).catch((err: Error) => {
      console.log("while getting " + uuid + " this error occurred : " + err.stack);
    });
  }

  bestScore(): number {
    return this.scores[this.bestPictureIndex]
  }

  bestPictureURI(): string {
    return this.picturesURI[this.bestPictureIndex];
  }

  latestPictureURI(): string {
    return this.picturesURI[this.picturesURI.length - 1];
  }


  addPic(uri: string) {
    this.picturesURI.push(uri);
    let newScore = this.simulateScore(uri);
    this.scores.push(newScore);
    if (newScore > this.bestScore()) {
      this.bestPictureIndex = this.scores.length - 1;
    }
    this.saveCard();
  }

  simulateScore(uri: string): number {
    return Math.round(100 * (Math.random() * 10)) / 100;
  }

  saveCard(): Promise<CardStored> {
    return this.storage.set(this.uuid, this.toCardStored())
  }

  toCardStored(): CardStored {
    return {
      title: this.title,
      picturesURI: this.picturesURI,
      scores: this.scores,
      bestPicture: this.bestPictureIndex,
    }
  }

}

export interface CardStored {
  title: string,
  picturesURI: string[],
  scores: number[],
  bestPicture: number,
}
