import {Picture, PictureStored} from "./picture-data";

export class Card {

  constructor(
    private title: string,
    private illustrationURI: string,
    private pictures: Picture[],
    private id: string,
  ) {}

  // GETTERS
  getTitle(): string { return this.title; }
  getIllustrationURI(): string { return this.illustrationURI; }
  getPictures(): Picture[] { return this.pictures; } //TODO make it encapsulated
  getID(): string { return this.id; }

  // USEFUL FUNCTIONS
  isEmpty(): boolean {
    return this.size() == 0;
  }

  size(): number {
    return this.pictures.length;
  }

  bestPicture(): Picture {
    return this.pictures[this.computeBestPic()];
  }

  bestScore(): number {
    if(this.isEmpty()){
      return 0;
    } else {
      return this.bestPicture().getScore();
    }
  }

  // SETTERS
  addPicture(picture: Picture): Card {
    this.pictures.push(picture);
    return this;
  }

  removePicture(picture: Picture): Card {
    let index = this.pictures.indexOf(picture);
    if (index > -1) {
      this.pictures.splice(index, 1);
    }
    return this;
  }

  // PRIVATE
  private computeBestPic(): number {
    let scores = this.pictures.map((pic) => pic.getScore());
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

  // EXPORT
  toCardStored(): CardStored {
    return {
      title: this.title,
      illustrationURI: this.illustrationURI,
      pictures: this.pictures.map((pic) => pic.toPictureStored()),
    }
  }

  // IMPORT
  static fromCardStored(cardStored: CardStored, cardID: string): Card {
    let title = cardStored.title;
    let illustrationURI = cardStored.illustrationURI;
    let pictures = cardStored.pictures.map((pictureStored) => Picture.fromPictureStored(pictureStored, cardID));

    return new Card(title, illustrationURI, pictures, cardID);
  }
}


export interface CardStored {
  title: string,
  illustrationURI: string,
  pictures: PictureStored[],
}
