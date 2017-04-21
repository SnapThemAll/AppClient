import {Injectable} from "@angular/core";
import {Camera} from "@ionic-native/camera";
import {Picture} from "./game-data/picture-data";
import {FileManager} from "./file-manager";

@Injectable()
export class CameraService {

  constructor(
    private camera: Camera,
    private fileManager: FileManager,
  ) {
    console.log('Hello PictureStorageService Provider');
  }


  takePicture(cardID: string): Promise<Picture> {
    let env = this;

    return env.camera.getPicture({
      quality: 75,
      targetWidth: 1000,
      targetHeight: 1000,
      //saveToPhotoAlbum : true,
      destinationType: this.camera.DestinationType.FILE_URI,
      cameraDirection : this.camera.Direction.BACK,
      encodingType : this.camera.EncodingType.JPEG
    }).then((imageURI: string) => {
      return env.fileManager.persistPicture(imageURI, cardID)
    })
  }

}
