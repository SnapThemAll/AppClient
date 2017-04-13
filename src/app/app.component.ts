import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {TabsPage} from "../pages/tabs/tabs";
import {Storage} from "@ionic/storage";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import {VersionStored} from "../providers/start-up-data/load-data";
import {UserService} from "../providers/user-service";
import {LevelsService} from "../providers/levels-service";
import {GameCreationService} from "../providers/game-creation-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor(
    platform: Platform,
    storage: Storage,
    http: Http,
    private splashScreen : SplashScreen,
    private statusBar: StatusBar,
    private gameCreationService: GameCreationService,
    private userService: UserService,
    private levelsService: LevelsService,
  ) {
    let env = this;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      let dbVersion: VersionStored = {
        key: "db_version",
        value: "0.0.1"
      };


      env.gameCreationService.loadData(dbVersion)
        .then(() => {
          return Promise.all([
            env.userService.fetch(),
            env.levelsService.loadLevels(),
          ]);
        })
        .then(() => {
          console.log("Envirronment ready! Splashscreen hiding...");
          env.rootPage = TabsPage;
          statusBar.styleDefault();
          splashScreen.hide();
        });

    });
  }

}

