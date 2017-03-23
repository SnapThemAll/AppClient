import {Component} from "@angular/core";
import {Storage} from "@ionic/storage";
import {ModalController, NavController, NavParams} from "ionic-angular";
import {Level} from "./level.interface";
import {CardPage} from "../card/card";
import {Card} from "../card/card.interface";

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
    public storage: Storage,
    public modalCtrl: ModalController
  ) {
    this.level = navParams.get("level");
    this.cards = this.level.getCards();
  }

  imgClicked(index: number) {
    let profileModal = this.modalCtrl.create(
      CardPage, {
        card: this.cards[index],
      }
    );
    profileModal.present();
  }

}

