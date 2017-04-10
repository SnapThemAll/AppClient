import {Component, ViewChild} from "@angular/core";
import {NavParams, Platform, Slides, ViewController} from "ionic-angular";
import {Card} from "../../providers/game-data/card-data";
import {Camera} from "@ionic-native/camera";
import {CardService} from "../../providers/card-service";
import {Transfer} from "@ionic-native/transfer";
import {File} from "@ionic-native/file";
@Component({
  selector: 'page-card',
  templateUrl: 'card.html'
})
export class CardPage {
  card: Card;
  @ViewChild(Slides) slides: Slides;

  constructor(
    public platform: Platform,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public cardService: CardService,
    private transfer: Transfer,
    private file: File,
    private camera: Camera,
  ) {
    this.card = navParams.get("card");
    //this.slides.slideTo(this.card.bestPictureIndex);
    //this.slideToWhenReady(this.card.getBestPictureIndex());
  }

  ionViewDidLoad(){
    this.slides.slideTo(this.card.getBestPictureIndex(), 0);
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

  uploadButtonClicked(index: number): any {
    this.uploadPicture(this.card, index);
  }

  uploadPicture(card: Card, index: number) {

    this.cardService.uploadPicture(card.getUUID(), card.getPicture(index))
      .subscribe((res) => {
        let score = res.json().score;
        card.updateScore(index, score);
      });

  }


  takePicture(): void {
    this.camera.getPicture({
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
      this.card.addPic(imageURI);
      this.slides.update();
      this.slideToWhenReady(this.card.size() - 1, 500);
    }, (err) => {
      console.log(err);
    });
  }

}
