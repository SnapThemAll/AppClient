import {Component} from "@angular/core";
import {ModalController, NavController, NavParams} from "ionic-angular";
import {Level} from "../../providers/game-data/level-data";
import {CardPage} from "../card/card";
import {Card} from "../../providers/game-data/card-data";

@Component({
  selector: 'page-level',
  templateUrl: 'level.html'
})
export class LevelPage {
  level: Level;
  cards: Card[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) {
    this.level = navParams.get("level");
    this.cards = this.level.getCards();
  }

  imgClicked(index: number) {
    let cardModal = this.modalCtrl.create(
      CardPage, {
        card: this.cards[index],
      }
    );
    cardModal.present();
  }

}

