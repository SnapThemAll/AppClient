import {Injectable} from "@angular/core";
import {File} from "@ionic-native/file";
import {Utils} from "./utils";
import {Platform} from "ionic-angular";
import {Picture} from "./game-data/picture-data";

@Injectable()
export class FileManager {

  constructor(
    private platform: Platform,
    private file: File,
  ) {
    console.log('Hello FileManager Provider');
  }

  //TODO be careful : this is android only
  dataDir(): string  {
    if(this.platform.is("android")){
      return this.file.externalDataDirectory;
    } else{
      return "";
    }
  }
  //TODO be careful : this is android only
  cacheDir(): string  {
    if(this.platform.is("android")){
      return this.file.externalCacheDirectory;
    } else{
      return "";
    }
  }


  persistPicture(imageURI:string, cardID: string): Promise<Picture> {
    let fileName = Utils.uriToFileName(imageURI);
    return this.moveFileInData(imageURI, cardID + "/" + fileName)
      .then((pictureURI) => new Picture(fileName, cardID, pictureURI));
  }

  createDirInData(dirName: string): Promise<string> {
    let path = this.dataDir() + dirName;
    return this.createDir(path)
      .then(() => path );
  }

  moveFileInData(fileURI: string, newFileRelativeURI: string): Promise<string> {
    let oldFileName = Utils.uriToFileName(fileURI);
    let oldPath = Utils.uriToParentPath(fileURI);
    let newFileName = Utils.uriToFileName(newFileRelativeURI);
    let relativePath = Utils.uriToParentPath(newFileRelativeURI);
    let newPath;
    return this.createDirInData(relativePath)
      .then((path) => {
        newPath = path;
        return this.file.moveFile(oldPath, oldFileName, path, newFileName)
      })
      .then(() => {
        return newPath + "/" + newFileName
      });
  }

  pictureToFormData(picture: Picture): Promise<FormData> {
    let directoryURI = Utils.uriToParentPath(picture.getPictureURI());
    let fileName = Utils.uriToFileName(picture.getPictureURI());
    let formData = new FormData();

    return this.file.readAsDataURL(directoryURI, fileName)
      .then((dataURI: string) => {
        let blob = Utils.dataURItoBlob(dataURI, "image/jpeg");
        formData.append("picture", blob, fileName);
        return formData;
      });
  }

  savePicture(fileData: Blob, fileName: string, cardID: string): Promise<Picture> {
    let pictureURI = this.cacheDir() + cardID + "/" + fileName;
    return this.saveBlob(fileData, pictureURI)
      .then(() => new Picture(fileName, cardID, pictureURI))
  }

  private saveBlob(fileData: Blob, fileURI: string): Promise<any> {
    let fileName = Utils.uriToFileName(fileURI);
    let filePath = Utils.uriToParentPath(fileURI);
    return this.file.writeFile(filePath, fileName, fileData);
  }

  private createDir(directoryURI: string): Promise<any> {
    let dirName = Utils.uriToFolderName(directoryURI);
    let dirPath = Utils.uriToParentPath(directoryURI);
    return this.file.createDir(dirPath, dirName, true);
  }

}

