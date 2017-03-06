import { Component } from '@angular/core';

import { Camera } from 'ionic-native';

import { NavController, NavParams } from 'ionic-angular';
import { Level } from "./level.interface";
import { Grid } from "./grid.interface";
import { Card } from "../card/card.interface";


@Component({
  selector: 'page-level',
  templateUrl: 'level.html'
})
export class LevelPage {
  level: Level;
  base64Image: string;
  grid: Grid;

  cards: Card[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.level = navParams.get("level");
    this.cards = [];
    this.grid = this.initGrid(9, 2);
  }

  private initGrid(num: number, col: number): Grid {
    let cards: Card[][] = [];
    let index = 1;
    for(let i = 0; i < Math.ceil(num/col); i++) {
      cards[i] = [];
      for (let j = 0; j < col ; j++, index++) {
        if(index <= num) {
          let card: Card = {
            uri: "assets/icon/numbers/" + ( index ) + ".svg",
            title: "Title " + index,
            score: i + j
          };
          cards[i].push(card);
          this.cards.push(card);
        } else { //this fills the last row
          cards[i].push({
            uri: null,
            title: null,
            score: null
          })
        }
      }
    }
    return {
      cards: cards
    }
  }

  imgClicked(i: number, j: number) {
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
      this.grid.cards[i][j].uri = this.base64Image;
    }, (err) => {
      console.log(err);
    });

  }

}
