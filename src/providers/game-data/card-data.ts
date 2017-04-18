import {Storage} from "@ionic/storage";
export class Card {

  constructor(private storage: Storage,
              private title: string,
              private pictures: Picture[],
              private bestPic: number,
              private uuid: string,
  ) {}

  static fromStorage(storage: Storage, uuid: string): Promise<Card> {
    let title: string, pictures: Picture[], bestPicture: number;

    return storage.get(uuid).then((cardStored: CardStored) => {

        title = cardStored.title;
        pictures = cardStored.pictures;
        bestPicture = cardStored.bestPic;

        console.log("Card " + uuid + " created");
        return new Card(storage, title, pictures, bestPicture, uuid);
      }
    ).catch((err: Error) => {
      console.log("while getting " + uuid + " this error occurred : " + err.stack);
    });
  }

  isEmpty(): boolean {
    return !(this.pictures.length > 1);
  }

  size(): number {
    return this.pictures.length;
  }

  getTitle(): string {
    return this.title;
  }

  getUUID(): string {
    return this.uuid;
  }

  getPictures(): Array<Picture> {
    return this.pictures;
  }

  getPictureURI(i: number): string {
    return this.pictures[i].pictureURI;
  }

  getScore(i: number): number {
    return Math.round(100 * this.pictures[i].score) / 100;
  }

  bestScore(): number {
    return Math.round(100 * this.getScore(this.bestPic)) / 100;
  }

  bestPictureURI(): string {
    return this.getPictureURI(this.bestPic);
  }

  latestPictureURI(): string {
    return this.getPictureURI(this.size() - 1);
  }

  savePicture(pictureURI: string, score: number): Promise<CardStored> {
    this.pictures.push({
      pictureURI: pictureURI,
      score: score,
    });
    return this.saveCard();
  }

  savePictureURI(pictureURI: string): Promise<CardStored> {
    return this.savePicture(pictureURI, 0);
  }

  updateScore(index: number, newScore: number): Promise<CardStored> {
    let pictureURI = this.getPictureURI(index);
    this.pictures[index] = {
      pictureURI: pictureURI,
      score: newScore,
    };
    if (newScore > this.bestScore()) {
      this.bestPic = index;
    }
    return this.saveCard();
  }

  removePicture(index: number): Promise<CardStored> {
    if (index > -1) {
      this.pictures.splice(index, 1);
      this.bestPic = this.computeBestPic();
      return this.saveCard();
    } else {
      return Promise.resolve(this.toCardStored());
    }
  }

  computeBestPic(): number {
    let scores = this.pictures.map((pic) => pic.score);
    let bestScore = -1;
    let bestPic = 0;
    scores.forEach((score, index) => {
      if(score > bestScore){
        bestScore = score;
        bestPic = index;
      }
    });
    return bestPic;
  }

  saveCard(): Promise<CardStored> {
    return this.storage.set(this.uuid, this.toCardStored())
  }

  toCardStored(): CardStored {
    return {
      title: this.title,
      pictures: this.pictures,
      bestPic: this.bestPic,
    }
  }
}

export interface Picture {
  pictureURI: string,
  score: number,
}

export interface CardStored {
  title: string,
  pictures: Picture[],
  bestPic: number,
}
