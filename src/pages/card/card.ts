import {Component, ViewChild} from "@angular/core";
import {Storage} from "@ionic/storage";
import {NavParams, Platform, Slides, ViewController} from "ionic-angular";
import {Card} from "./card.interface";
import {Camera, FileUploadOptions, FileUploadResult, Transfer} from "ionic-native";

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
    public storage: Storage,
    public viewCtrl: ViewController
  ) {
    this.card = navParams.get("card");
    //this.slides.slideTo(this.card.bestPictureIndex);
    this.slideToWhenReady(this.card.bestPictureIndex);
  }

  slideToWhenReady(index: number, speed?: number) {
    if (!this.slides) {
      setTimeout(() => {
        this.slideToWhenReady(index);
        console.log("slides not ready");
      }, 20);
    } else {
      setTimeout(() => {
        console.log("slides ready");
        this.slides.slideTo(index, !speed ? 0 : speed);
      }, 20);
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
    /*/
     this.card.addPic("assets/img/cat.jpg");
     this.slides.update();
     this.slideToWhenReady(this.card.picturesURI.length - 1, 500);
     /*/
    this.takePicture();
    //*/
  }

  uploadButtonClicked(index: number): any {
    this.uploadPicture(this.card.picturesURI[index]);
  }

  uploadPicture(pictureURI: string): number {
    let fileTransfer = new Transfer();

    let url = "http://gregunz.io/SnapThemAll/upload.php";

    // File for Upload
    let targetPath = pictureURI;

    // File name only
    let filename = targetPath.replace(/^.*[\\\/]/, '');

    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {'fileName': filename}
    };

    fileTransfer.upload(targetPath, url, options).then((res: FileUploadResult) => {
      alert("Success " + targetPath + " " + filename + " " + res.response);
    }).catch((e) => {
      alert("Failure " + targetPath + " " + filename + " " + e);
    });

    return 0;
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
      this.card.addPic(imageURI);
      this.slides.update();
      this.slideToWhenReady(this.card.picturesURI.length - 1, 500);
    }, (err) => {
      console.log(err);
    });
  }

}
