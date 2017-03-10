import {Component} from "@angular/core";
import {Storage} from "@ionic/storage";
import {NavParams, Platform, ViewController} from "ionic-angular";
import {Card} from "./card.interface";
import {Camera} from "ionic-native";

@Component({
  selector: 'page-card',
  templateUrl: 'card.html'
})
export class CardPage {
  card: Card;

  constructor(
    public platform: Platform,
    public navParams: NavParams,
    public storage: Storage,
    public viewCtrl: ViewController
  ) {
    this.card = navParams.get("card");
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  buttonClicked() {
    this.takePicture();
  }

  takePicture(): void {
    Camera.getPicture({
      quality: 75,
      targetWidth: 1000,
      targetHeight: 1000,
      //saveToPhotoAlbum : true,
      destinationType: Camera.DestinationType.FILE_URI,
      cameraDirection : Camera.Direction.BACK,
      encodingType : Camera.EncodingType.JPEG
    }).then((imageURI) => {
      // imageData is a base64 encoded string
      //base64Image = "data:image/jpeg;base64," + imageData;
      this.card.picturesURI.push(imageURI);
      this.card.scores.push(Math.random() * 10);
      this.storage.set(this.card.uuid, this.card).then(() => {
        console.log("card successfully stored");
      });
    }, (err) => {
      console.log(err);
    });
  }
}
