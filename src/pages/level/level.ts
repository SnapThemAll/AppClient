import { Component } from '@angular/core';
import { Storage } from "@ionic/storage";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.level = navParams.get("level");
    this.cards = this.initCards(10);
    this.cards = this.fetchCards();


  }

  private fetchCards(): Card[]{
    let cards: Card[] = [];
    for (let i = 0; i < this.cards.length; i++) {
      cards.push(this.cards[i]);

      /* UPDATE TITLE
      this.storage.get("card_title_" + i).then((storedTitle) => {
        cards[i].title = storedTitle;
      });*/

      this.storage.get("card_uri_"+ this.level.id + "_" + i).then((storedURI) => {
        if(storedURI != null) {
          cards[i].uri = storedURI;
        }
      }, (err) => {
        console.log(err)
      });
    }
    return cards;
  }

  private initCards(num: number): Card[] {
    let cards: Card[] = [];
    for(let i = 0; i < num; i++) {
      /*
      */

      let card: Card = {
        uri: "assets/img/black.svg",
        title: "Title " + (i + 1),
        score: (i + 1)
      };
      cards.push(card);
    }
    return cards;
  }

  imgClicked(index: number) {
    this.takePicture(index);
  }

  takePicture(index: number): void {
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
      this.storage.set("card_uri_" + this.level.id + "_" + index, imageURI);
      this.cards[index].uri = imageURI;
    }, (err) => {
      console.log(err);
    });
  }
}
