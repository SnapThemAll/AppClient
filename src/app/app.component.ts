import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {TabsPage} from "../pages/tabs/tabs";
import {VersionStored} from "../providers/start-up-data/load-data";
import {UserService} from "../providers/user-service";
import {GameCreationService} from "../providers/game-creation-service";
import {GameStorageService} from "../providers/game-storage-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor(
    private platform: Platform,
    private splashScreen : SplashScreen,
    private statusBar: StatusBar,
    private gameCreationService: GameCreationService,
    private userService: UserService,
    private gameStorageService: GameStorageService,
  ) {
    let env = this;

    env.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      let dbVersion: VersionStored = {
        key: "db_version",
        value: "0.0.2"
      };


      env.gameCreationService.loadData(dbVersion)
        .then(() => {
          return Promise.all([
            env.userService.fetch(),
            env.gameStorageService.loadGame(),
          ]);
        })
        .then(() => {
          console.log("Environment ready! Splash screen hiding...");
          env.rootPage = TabsPage;
          statusBar.styleDefault();
          splashScreen.hide();
        });

    });
  }

}

