import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/add/operator/map";
import {Observable} from "rxjs";
import {UserService} from "./user-service";
import {Picture} from "./game-data/picture-data";
import {FileManager} from "./file-manager";
import {WorldUser} from "./user-data/user-data";

@Injectable()
export class ApiService {

  private apiUrl = "http://localhost/api";

  constructor(
    public http: Http,
    private fileManager: FileManager,
    private userService: UserService,
  ) {
    console.log('Hello ApiService Provider');
  }

  apiGet(url: string): Observable<Response> {
    return this.http.get(this.apiUrl + url, {withCredentials: true})
  }

  apiPost(url: string, body: any): Observable<Response> {
    return this.http.post(this.apiUrl + url, body, {withCredentials: true})
  }

  authenticate(provider: string, accessToken: string): Observable<Response> {
    return this.apiGet("/authenticate/token/" + provider + "?access_token=" + accessToken )
  }

  fbAuth(): any {
    let env = this;
    env.authenticate("facebook", env.userService.user.authToken)
      .subscribe((res) => {
        console.log("Authenticating to the server: " + res.text())
      })
  }

  getPicture(fileName: string, cardID: string,): Observable<Blob> {
    return this.apiGet("/getpic/"  + cardID + "/" + fileName)
      .map((res: Response) => res.blob())
  }

  getPictureData(): Observable<PictureData[]> {
    return this.apiGet("/getpicdata")
      .map((res: Response) => res.json())
  }

  getWorldUsers(): Observable<WorldUser[]> {
    return this.apiGet("/getworldusers")
      .map((res: Response) => res.json())
  }

  private pictureDatasToObs(pictures: PictureData[]): Observable<Picture[]> {
    let env = this;
    let arrayOfObservables: Observable<Picture>[] = pictures.map((picData) =>
      env.getPicture(picData.fileName, picData.cardID)
        .flatMap((blob) => Observable.fromPromise(env.fileManager.savePicture(blob, picData.fileName, picData.cardID)))
        .map((picture) => picture.setUploaded(true))
    );
    return Observable.combineLatest(arrayOfObservables);
  }

  getPictures(): Observable<Picture[]> {
    let env = this;
    return env.getPictureData()
      .flatMap((pictures) => env.pictureDatasToObs(pictures))
  }

  getScore(id: string): Observable<Response> {
    return this.apiGet("/getscore/" + id)
  }

  removePicture(picture: Picture): Observable<Response> {
    return this.apiGet("/removepic/" + picture.getCardID() + "/" + picture.getFileName())
  }

  uploadPicture(picture: Picture): Observable<Picture> {
    let env = this;
    picture.setUploading(true);

    return env.uploadPictureAndGetScore(picture)
      .map((score) => {
        picture.setScore(score);
        picture.setUploaded(true);
        picture.setUploading(false);
        return picture;
      })
  }

  uploadFeedback(msg: String): Observable<Response> {
    return this.apiPost("/uploadfeedback", msg)
  }

  private uploadPictureAndGetScore(picture: Picture): Observable<number> {
    let env = this;

    return Observable.fromPromise(
      env.fileManager.pictureToFormData(picture)
        .then(formData => {
          return env.uploadPictureFormData(picture.getCardID(), formData).toPromise()
        })
    );
  }

  alertResponseTextAndHeaders(response: Observable<Response>){
    response.subscribe((res) => {
      alert(res.text() + JSON.stringify(res.headers.toJSON(), null, 4));
    })
  }

  private uploadPictureFormData(cardID: string, formData: FormData): Observable<number> {
    let env = this;
    return env.apiPost("/uploadpic/" + cardID, formData)
      .map((res: Response) => {
        return res.json().score;
      });
  }

}

export interface PictureData {
  fileName: string,
  cardID: string,
  score: number,
}
