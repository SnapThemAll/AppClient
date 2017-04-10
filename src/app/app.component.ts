import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import { SplashScreen } from '@ionic-native/splash-screen';
import {TabsPage} from "../pages/tabs/tabs";
import {Storage} from "@ionic/storage";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import {Data, Version} from "../providers/start-up-data/load-data";

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
    private statusBar: StatusBar
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      let dbVersion: Version = {
        key: "version",
        value: "0.0.1"
      };

      Data.getVersion(dbVersion, storage)
        .then((versionIsDifferent) => {
          if (versionIsDifferent) {
            return Data.storeDataFromJson(storage, http);
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          console.log("Database ready! Splashscreen hiding...");
          this.rootPage = TabsPage;
          statusBar.styleDefault();
          splashScreen.hide();
        });

    });
  }

}

