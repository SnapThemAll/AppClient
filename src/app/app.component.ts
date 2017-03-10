import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {TabsPage} from "../pages/tabs/tabs";
import {LevelStored} from "../pages/level/level.interface";
import {CardStored} from "../pages/card/card.interface";
import {Storage} from "@ionic/storage";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      let level_0: LevelStored = {
        title: "title level 0",
        score: 0,
        scoreToUnlock: 0,
        cardsUUID: ["card_0_0", "card_0_1"],
      };

      let card_0_0: CardStored = {
        title: "title card 0",
        bestPicture: 0,
        picturesURI: ["assets/img/black.svg"],
        scores: [2],
      };

      let card_0_1: CardStored = {
        title: "title card 1",
        bestPicture: 0,
        picturesURI: ["assets/img/black.svg"],
        scores: [1],
      };

      let firstStart = "FirstStart7";
      storage.get(firstStart).then((value) => {
        if (value == null) {
          console.log("It was the first start");
          return Promise.all([
            storage.set("levelsUUID", ["level_0"]),
            storage.set("level_0", level_0),
            storage.set("card_0_0", card_0_0),
            storage.set("card_0_1", card_0_1),
            storage.set(firstStart, true),
          ]).then(() => console.log("Storage updated"));
        }
      });

      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
