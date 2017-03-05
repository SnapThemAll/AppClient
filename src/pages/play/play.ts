import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { LevelPage } from '../level/level'

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

  constructor(public navCtrl: NavController) {

  }

  items = [
    'Pokémon Yellow',
    'Super Metroid',
    'Mega Man X',
    'The Legend of Zelda',
    'Pac-Man',
    'Super Mario World',
    'Street Fighter II',
    'Half Life',
    'Final Fantasy VII',
    'Star Fox',
    'Tetris',
    'Donkey Kong III',
    'GoldenEye 007',
    'Doom',
    'Fallout',
    'GTA',
    'Halo'
  ];

  itemSelected(levelName: string, levelNum: number) {
    this.navCtrl.push(LevelPage, {
      levelName: levelName,
      levelNum: levelNum
    })
  }
}
