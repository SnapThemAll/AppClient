import {Component, ViewChild} from "@angular/core";
import {NavParams, Slides, ViewController, AlertController} from "ionic-angular";
import {Card} from "../../providers/game-data/card-data";
import {Camera} from "@ionic-native/camera";
import {ApiService} from "../../providers/api-service";
import {GameStorageService} from "../../providers/game-storage-service";
import {Picture} from "../../providers/game-data/picture-data";
@Component({
  selector: 'page-card',
  templateUrl: 'card.html'
})
export class CardPage {
  card: Card;
  @ViewChild(Slides) slides: Slides;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private gameStorageService: GameStorageService,
    private apiService: ApiService,
    private camera: Camera,
  ) {
    this.card = navParams.get("card");
  }

  ionViewDidEnter(){
    console.log("ionViewDidEnter Card Page " + this.card.getID())
  }

  slideToWhenReady(index: number, speed?: number) {
    if (!this.slides) {
      setTimeout(() => {
        this.slideToWhenReady(index);
        console.log("slides not ready");
      }, 50);
    } else {
      setTimeout(() => {
        console.log("slides ready");
        this.slides.slideTo(index, !speed ? 0 : speed);
      }, 50);
    }
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log("Current index is", currentIndex);
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  displayScore(picture: Picture): string {
    if ( picture.isUploading() ) {
      return "Computing score..."
    } else if ( !picture.isUploaded() ){
      return "Upload picture to compute score"
    } else {
      return "Score: " + picture.getScore().toFixed(2)
    }
  }

  snapItButtonClicked() {
    this.takePicture();
  }

  removeButtonClicked(picture: Picture): any {
    this.presentConfirm(picture);
  }

  computeScoreButtonClicked(picture: Picture): any {
    this.uploadPicture(picture);
  }

  private presentConfirm(picture: Picture) {
    let alert = this.alertCtrl.create({
      title: 'Remove picture',
      message: 'Are you sure you want to remove this picture on the device and on the server?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.removePicture(picture);
            console.log('Confirm clicked');
          }
        }
      ]
    });
    alert.present();
  }

  private removePicture(picture: Picture): any {
    let env = this;
    if(picture.isUploaded()) {
      env.apiService.removePicture(env.card.getID(), picture.getPictureURI())
        .subscribe(
          () => {
            env.slides.slidePrev();
            env.card.removePicture(picture);
            env.gameStorageService.saveCard(env.card);
            env.slides.update();
          },
          (error) => {
            env.apiService.fbAuth();
            console.log("Error while trying to remove a picture: " + error);
            alert("Connection to the server failed. Try again");
          })
    } else {
      env.slides.slidePrev();
      env.card.removePicture(picture);
      env.slides.update();
    }
  }


  private uploadPicture(picture: Picture) {
    let env = this;
    env.apiService.uploadPicture(picture.toPictureToUpload(env.card))
      .subscribe(
        () => {
          env.gameStorageService.saveCard(env.card)
        },
        (error) => {
          env.apiService.fbAuth();
          picture.setUploading(false);
          console.log("Error while trying to upload a picture: " + error);
          alert("Connection to the server failed. Try again");
        }
      );

  }


  private takePicture(): Promise<any> {
    return this.camera.getPicture({
      quality: 75,
      targetWidth: 1000,
      targetHeight: 1000,
      //saveToPhotoAlbum : true,
      destinationType: this.camera.DestinationType.FILE_URI,
      cameraDirection : this.camera.Direction.BACK,
      encodingType : this.camera.EncodingType.JPEG
    }).then((imageURI) => {
      // imageData is a base64 encoded string
      //base64Image = "data:image/jpeg;base64," + imageData;
      let picture = new Picture(imageURI);
      this.card.addPicture(picture);
      this.uploadPicture(picture);
      this.slides.update();
      this.slideToWhenReady(this.card.size() - 1, 500);
    }).catch((err) => {
      console.log(err);
    });
  }

}
