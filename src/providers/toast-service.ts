import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";

/*
  Generated class for the ToastService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ToastService {

  defaultDuration: number = 2000; //in ms
  toastOnScreen: boolean;

  constructor(
    private toastCtrl: ToastController,
  ) {
    console.log('Hello ToastService Provider');
    this.toastOnScreen = false;
  }

  topToast(message: string, duration?: number) {
    this.presentToast(message, duration ? duration : this.defaultDuration, 'top')
  }

  middleToast(message: string, duration?: number) {
    this.presentToast(message, duration ? duration : this.defaultDuration, 'middle')
  }

  bottomToast(message: string, duration?: number) {
    this.presentToast(message, duration ? duration : this.defaultDuration, 'bottom')
  }

  private presentToast(message: string, duration: number, position: string) {
    let env = this;
    if(!env.toastOnScreen) {
      env.toastOnScreen = true;
      let toast = env.toastCtrl.create({
        message: message,
        duration: duration,
        position: position
      });

      toast.onDidDismiss(() => {
        env.toastOnScreen = false;
        console.log('Dismissed toast');
      });

      toast.present();
    }
  }

}
