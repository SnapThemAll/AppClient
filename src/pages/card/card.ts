import {Component, ViewChild} from "@angular/core";
import {Platform, NavParams, Slides, ViewController, AlertController} from "ionic-angular";
import {Card} from "../../providers/game-data/card-data";
import {ApiService} from "../../providers/api-service";
import {GameStorageService} from "../../providers/game-storage-service";
import {Picture} from "../../providers/game-data/picture-data";
import {CameraService} from "../../providers/camera-service";
import {ToastService} from "../../providers/toast-service";

@Component({
  selector: 'page-card',
  templateUrl: 'card.html'
})
export class CardPage {
  @ViewChild(Slides) slides: Slides;
  card: Card;

  constructor(
    private platform: Platform,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private gameStorageService: GameStorageService,
    private apiService: ApiService,
    private cameraService: CameraService,
    private toastService: ToastService,
  ) {
    this.card = navParams.get("card");

    platform.registerBackButtonAction(() => { this.dismiss() });
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

  cameraButtonClicked() {
    if(this.card.getPictures().length < 10){
      this.takePicture();
    } else {
      this.toastService.middleToast("You can't have more than 10 pictures per category")
    }
  }

  takePicture() {
    let env = this;
    env.cameraService.takePicture(env.card.getID())
      .then((picture) => {
        env.card.addPicture(picture);
        env.gameStorageService.savePicture(picture);
        env.gameStorageService.saveCard(env.card);
        env.uploadPicture(picture);
        // visual transition
        env.slides.update();
        env.slideToWhenReady(this.card.size(), 500);
      })
      .catch((error) => {
        console.log("Error trying to take a picture: " + JSON.stringify(error))
      })
  }

  removeButtonClicked(picture: Picture): any {
    this.presentConfirm(picture);
  }

  uploadButtonClicked(picture: Picture): any {
    this.uploadPicture(picture);
  }

  private presentConfirm(picture: Picture) {
    let alert = this.alertCtrl.create({
      title: 'Remove picture',
      message: 'Do you want to remove the picture from your phone (and server if it has been uploaded already) ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            if(picture.isUploaded()){
              this.removePictureOnServerAndPhone(picture)
            } else {
              this.removePictoreOnPhone(picture);
            }
            console.log('Yes clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    alert.present();
  }

  private removePictoreOnPhone(picture: Picture): any {
    this.slides.slidePrev();
    this.card.removePicture(picture);
    this.gameStorageService.saveCard(this.card);
    this.slides.update();
  }

  private removePictureOnServerAndPhone(picture: Picture): any {
    let env = this;
    if(picture.isUploaded()) {
      env.apiService.removePicture(picture)
        .subscribe(
          () => {
            env.removePictoreOnPhone(picture);
          },
          (error) => {
            console.log("Error while trying to remove a picture: " + JSON.stringify(error));
            let message = "Connection to the server failed. Check your connection and try again";
            env.toastService.bottomToast(message);
          })
    } else {
      env.toastService.bottomToast("You can't remove a picture from server if it has not been uploaded first.");
    }
  }


  private uploadPicture(picture: Picture) {
    let env = this;
    if(!picture.isUploading()) {
      env.apiService.uploadPicture(picture)
        .subscribe(
          (picture) => {
            env.gameStorageService.savePicture(picture)
          },
          (error) => {
            picture.setUploading(false);
            console.log("Error while trying to upload a picture: " + JSON.stringify(error));
            let message = "Connection to the server failed. Try again";
            if(error.status == 403){
              message = error._body
            }
            env.toastService.bottomToast(message);
          });
    }
  }



}
