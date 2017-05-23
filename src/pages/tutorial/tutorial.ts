import {Component} from "@angular/core";
import {Platform, ViewController} from "ionic-angular";

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  slides = [
    {
      title: "Welcome",
      description:
      "Snap Them All is a game where your goal is to take <b>snaps</b> of almost everything. " +
      "Our algorithm gives you back a <b>score</b> reprensenting how much your snap helps us.",
      image: "../../assets/img/tutorial/welcome.png",
    },
    {
      title: "What is a good snap?",
      description: "A good snap is unique. " +
      "This means you should think about the <b>angle</b>, the <b>location</b>, the <b>background</b>, etc.. \n\n" +
      "Be yourself, be <b>creative</b>.",
      image: "../../assets/img/tutorial/good_snap.png",
    }
    // ,
    // {
    //   title: "What is Ionic Cloud?",
    //   description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
    //   image: "assets/img/numbers/3.png",
    // }
  ];

  constructor(
    private platform: Platform,
    private viewCtrl: ViewController,
  ){

    platform.registerBackButtonAction(() => {this.dismiss()})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
  }

  dismiss() {
      this.viewCtrl.dismiss();
  }

}
