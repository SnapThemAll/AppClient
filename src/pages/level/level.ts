import {Component} from "@angular/core";
import {Storage} from "@ionic/storage";
import {NavController, NavParams, ModalController} from "ionic-angular";
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
    this.cards = this.level.cards;
  }

  /*
  private fetchCards() {
   for (let i = 0; i < this.cards.length; ++i) {
      this.storage.get(this.cards[i].uuid).then((storedCard) => {
        if(storedCard != null) {
          this.cards[i] = storedCard;
        }
      }, (err) => {
        console.log(err)
      });
    }
  }

  private initCards(num: number): Card[] {
    let cards: Card[] = [];
    for(let i = 0; i < num; i++) {
      cards.push({
   picturesURI: "assets/img/black.svg",
        title: "Title " + (i + 1),
        score: (i + 1),
   uuid: "card_" + this.level.num + "_" + i,
        snapped: false,
      });
    }
    return cards;
  }
   */

  imgClicked(index: number) {
    let profileModal = this.modalCtrl.create(
      CardPage, {
        card: this.cards[index]
      }
    );
    profileModal.present();
  }

}

