import {Injectable} from "@angular/core";
import {Toast, ToastController} from "ionic-angular";

/*
  Generated class for the ToastService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ToastService {

  defaultDuration: number = 2000; //in ms
  toastsOnScreen: Toast[] = [];

  constructor(
    private toastCtrl: ToastController,
  ) {
    console.log('Hello ToastService Provider');
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

  dismissAll(): void {
    this.toastsOnScreen.forEach((toast) => toast.dismissAll());
  }

  private presentToast(message: string, superposition: boolean, duration: number, position: string) {
    let env = this;
    if( (superposition ? superposition : false) || env.toastsOnScreen.length == 0) {
      let toast = env.toastCtrl.create({
        message: message,
        duration: duration ? duration : this.defaultDuration,
        position: position
      });

      this.toastsOnScreen.push(toast);

      toast.onDidDismiss(() => {
        this.toastsOnScreen.pop(); //TODO: Might be poping the wrong one !
        console.log('Dismissed toast');
      });

      toast.present();
    }
  }

}
