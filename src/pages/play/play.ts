import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { LevelPage } from '../level/level'
import {Level} from "../level/level.interface";

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})

export class PlayPage {
  levels: Level[];

  constructor(public navCtrl: NavController) {
    this.levels = [];

    for(let i = 1; i < 10; i++){
      this.levels.push({
        title: "Title of level " + i,
        id: i,
        score: i * 20 + 20
      });
    }
  }


  itemSelected(level: Level) {
    this.navCtrl.push(LevelPage, {
      level: level
    })
  }

}
