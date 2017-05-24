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

  topToast(message: string, superposition?: boolean, duration?: number) {
    this.presentToast(message, superposition, duration, 'top')
  }

  middleToast(message: string, superposition?: boolean, duration?: number) {
    this.presentToast(message, superposition, duration, 'middle')
  }

  bottomToast(message: string, superposition?: boolean, duration?: number) {
    this.presentToast(message, superposition , duration, 'bottom')
  }

  private presentToast(message: string, superposition: boolean, duration: number, position: string) {
    let env = this;
    if( (superposition ? superposition : false) || !env.toastOnScreen) {
      env.toastOnScreen = true;
      let toast = env.toastCtrl.create({
        message: message,
        duration: duration ? duration : this.defaultDuration,
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
