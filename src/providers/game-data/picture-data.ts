export class Picture {

  private uploading: boolean = false;

  constructor(
    private fileName: string,
    private cardID: string,
    private pictureURI: string,
    private score: number = 0,
    private uploaded: boolean = false,
  ) {}

  // GETTERS
  getFileName(): string { return this.fileName; }
  getcardID(): string { return this.cardID; }
  //getFolderURI(dataDirectory: string): string { return dataDirectory + this.cardID; }
  getPictureURI(): string { return this.pictureURI; }
  getScore(): number { return this.score; }
  getID(): string { return this.fileName; }
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
      fileName: this.fileName,
      cardID: this.cardID,
      score: this.score,
      uploaded: this.uploaded,
    }
  }
}

export interface PictureStored {
  fileName: string,
  cardID: string,
  score: number,
  uploaded: boolean,
}

