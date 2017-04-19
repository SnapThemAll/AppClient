import {Card} from "./card-data";

export class Picture {

  private uploading: boolean = false;

  constructor(
    private pictureURI: string,
    private score: number = 0,
    private uploaded: boolean = false,
  ) {}

  // GETTERS
  getPictureURI(): string { return this.pictureURI; }
  getScore(): number { return this.score; }
  isUploading(): boolean { return this.uploading; }
  isUploaded(): boolean { return this.uploaded; }

  // SETTERS
  setScore(newScore: number): Picture {
    this.score = newScore;
    return this;
  }
  setUploading(isUploading: boolean): Picture {
    this.uploading = isUploading;
    return this;
  }
  setUploaded(isUploaded: boolean): Picture {
    this.uploaded = isUploaded;
    return this;
  }

  // USEFUL FUNCTIONS

  canRemove(): boolean {
    return !this.uploading;
  }

  canUpload(): boolean {
    return !this.uploaded && !this.uploading;
  }

  // EXPORT
  toPictureStored(): PictureStored {
    return {
      pictureURI: this.pictureURI,
      score: this.score,
      uploaded: this.uploaded,
    }
  }

  toPictureToUpload(card: Card): PicToUpload {
    return {
      card: card,
      picture: this,
    }
  }

  // IMPORT
  static fromPictureStored(pictureStored: PictureStored): Picture {
    return new Picture(
      pictureStored.pictureURI,
      pictureStored.score
    )
  }

}

export interface PictureStored {
  pictureURI: string,
  score: number,
  uploaded: boolean,
}


export interface PicToUpload {
  card: Card,
  picture: Picture,
}
