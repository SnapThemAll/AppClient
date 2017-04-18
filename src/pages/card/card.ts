import {Component, ViewChild} from "@angular/core";
import {NavParams, Slides, ViewController} from "ionic-angular";
import {Card} from "../../providers/game-data/card-data";
import {Camera} from "@ionic-native/camera";
import {ApiService} from "../../providers/api-service";
@Component({
  selector: 'page-card',
  templateUrl: 'card.html'
})
export class CardPage {
  card: Card;
  @ViewChild(Slides) slides: Slides;
  uploadInProgress: boolean = false;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private apiService: ApiService,
    private camera: Camera,
  ) {
    this.card = navParams.get("card");
    //this.slides.slideTo(this.card.bestPictureIndex);
    //this.slideToWhenReady(this.card.getBestPictureIndex());
  }

  ionViewDidLoad(){
    //this.slideToWhenReady(this.card.getBestPictureIndex());
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

  snapItButtonClicked() {
    this.takePicture();
  }

  removeButtonClicked(index: number): any {
    let env = this;
    env.apiService.removePicture(env.card.getUUID(), env.card.getPictureURI(index))
      .subscribe(
        () => {
          env.card.removePicture(index);
          env.slides.slidePrev();
          env.slides.update();
        },
        (error) => {
          env.apiService.fbAuth();
          console.log("Error while trying to remove a picture: " + error);
          alert("Connection to the server failed. Try again");
        })
  }

  computeScoreButtonClicked(index: number): any {
    this.uploadPicture(this.card, index);
  }

  uploadPicture(card: Card, index: number) {
    let env = this;
    env.uploadInProgress = true;
    env.apiService.uploadPicture(card.getUUID(), card.getPictureURI(index))
      .subscribe((score) => {
          card.updateScore(index, score);
          env.uploadInProgress = false;
        },
        (error) => {
          env.apiService.fbAuth();
          console.log("Error while trying to upload a picture: " + error);
          alert("Connection to the server failed. Try again");
        }
      );

  }


  takePicture(): Promise<any> {
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
      this.card.savePictureURI(imageURI);
      this.uploadPicture(this.card, this.card.size() - 1);
      this.slides.update();
      this.slideToWhenReady(this.card.size() - 1, 500);
    }, (err) => {
      console.log(err);
    });
  }

}
