import {Component} from "@angular/core";
import {Platform, ViewController} from "ionic-angular";
import {ApiService} from "../../../providers/api-service";
import {ToastService} from "../../../providers/toast-service";

@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  msg: string = "";

  constructor(
    private platform: Platform,
    private viewCtrl: ViewController,
    private toastService: ToastService,
    private apiService: ApiService,
  ){

    platform.registerBackButtonAction(() => {this.dismiss()})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  send(msg: string){
    let env = this;
    if(msg.length == 0){
      this.toastService.middleToast("Your message is empty :(")
    } else {
      env.apiService.uploadFeedback(msg)
        .subscribe((success) => {
            env.dismiss().then(() => this.toastService.middleToast("Thank you for your feedback :)"))
          },
          (error) => {
            this.toastService.middleToast("An error occured while connecting to the server. Try again.");
            console.log("An error occured during the upload of a feedback:" + JSON.stringify(error));
          })
    }
  }

  dismiss(): Promise<any> {
    return this.viewCtrl.dismiss();
  }

}
