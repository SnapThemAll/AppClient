import { Component } from '@angular/core';

import { Camera } from 'ionic-native';

import { NavController, NavParams } from 'ionic-angular';
import { Level } from "./level.interface";
import { Card } from "../card/card.interface";


@Component({
  selector: 'page-card',
  templateUrl: 'card.html'
})
export class CardPage {
  card: Card;
  base64Image: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.card = navParams.get("card");
  }


  imgClicked() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }

}
