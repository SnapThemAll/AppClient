import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/add/operator/map";
import {Observable} from "rxjs";
import {File} from "@ionic-native/file";
import {UserService} from "./user-service";

@Injectable()
export class CardService {

  private apiUrl = "http://ts.gregunz.com";

  constructor(
    public http: Http,
    private fileModule: File,
    private userService: UserService,
  ) {
    console.log('Hello CardService Provider');
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

  uploadPicture(cardName: string, pictureURI: string): Observable<Response> {
    let env = this;

    let directoryURI = pictureURI.substring(0, pictureURI.lastIndexOf('/'));
    let fileName = pictureURI.replace(/^.*[\\\/]/, '');
    let formData = new FormData();


    return Observable.fromPromise(
      env.fileModule.readAsDataURL(directoryURI, fileName)
        .then((dataURI: string) => {

          let blob = env.dataURItoBlob(dataURI, "image/jpeg");
          formData.append("picture", blob, fileName);

          return env.apiPost("/uploadpic/" + cardName, formData).toPromise()
        })
        .catch((error) => {
          env.fbAuth();
          alert("Upload failed. Try again");
          console.log("Error while trying to upload the picture: " + error)
        })
    );
  }

  alertResponseTextAndHeaders(response: Observable<Response>){
    response.subscribe((res) => {
      alert(res.text() + JSON.stringify(res.headers.toJSON(), null, 4));
    })
  }


  private dataURItoBlob(dataURI, dataTYPE) {
    let binary = atob(dataURI.split(',')[1]), array = [];
    for(let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: dataTYPE});
  }

}
