import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {ApiService, PictureData} from "./api-service";
import {Picture} from "./game-data/picture-data";
import {UserService} from "./user-service";
import {GameStorageService} from "./game-storage-service";
import {ToastService} from "./toast-service";

@Injectable()
export class UpdateService {

  picturesToUpload: Picture[] = [];
  picturesToDownload: PictureData[] = [];

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private gameStorageService: GameStorageService,
    private toastService: ToastService,
  ) {
    console.log('Hello UpdateService Provider');
  }

  refresh(): Promise<any> {
    let env = this;
    env.picturesToUpload = env.loadPicturesToUpload();

    return env.apiService.getPictureData().toPromise()
      .then((picturesData) => {
        env.picturesToDownload = picturesData.filter((pic) => !env.isLocal(pic.cardID, pic.fileName));
      })
  }

  uploadAllPictures(): Promise<any>[]{
    let env = this;
    let didAuth = false;
    return env.picturesToUpload
      .map((picture) => {
        if (picture.isUploading()) {
          return Promise.resolve();
        } else {
          return env.apiService.uploadPicture(picture).toPromise()
            .then(
              (picture) => {
                env.gameStorageService.savePicture(picture);
                env.toastService.bottomToast(picture.getCardID() + " uploaded", true);
                env.picturesToUpload = env.loadPicturesToUpload();
              })
            .catch((error) => {
                if (!didAuth) {
                  didAuth = true;
                  env.apiService.fbAuth(env.userService.user.authToken);
                }
                picture.setUploading(false);
                console.log("Error while trying to upload a picture: " + JSON.stringify(error));
              }
            )
        }
      })
  }

  private isLocal(cardID: string, fileName: string): boolean {
    return this.gameStorageService.game
      .getAllPictures()
      .some((pic) => pic.getCardID() == cardID && pic.getFileName() == fileName);
  }

  private loadPicturesToUpload(): Picture[] {
    return this.gameStorageService.game.getAllPictures()
      .filter((pic) => !pic.isUploaded())
  }
}
