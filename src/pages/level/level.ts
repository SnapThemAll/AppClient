import { Component } from '@angular/core';

import { Camera } from 'ionic-native';

import { NavController, NavParams } from 'ionic-angular';
import { Level } from "./level.interface";

export interface Card {
  uri: string,
  title: string,
  score: number
}

@Component({
  selector: 'page-level',
  templateUrl: 'level.html'
})
export class LevelPage {
  level: Level;
  cards: Card[];
  base64Image: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.level = navParams.get("level");
    this.cards = this.initCards(9, 3)
  }

  private static initCards(num: number, col: number): Card[] {
    let cards: Card[] = [];
    for(let i = 1; i <= num; i++) {
      let card: Card = {
        uri: "assets/img/black.jpg",
        title: "Title " + i,
        score: i
      };
      cards.push(card);
    }
    return cards;
  }

  imgClicked(index: number) {
    this.cards[index].uri = (index % 2 == 0) ? "assets/img/large.jpg" : "assets/img/tall.jpg";
    Camera.getPicture({
      quality : 100,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000,
      saveToPhotoAlbum: false
    }).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.cards[index].uri = this.base64Image;
    }, (err) => {
      console.log(err);
    });

  }

}
