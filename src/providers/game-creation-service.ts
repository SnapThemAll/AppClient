import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import {Data, VersionStored} from "./start-up-data/load-data";
import {Storage} from "@ionic/storage";


/*
  Generated class for the GameCreationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GameCreationService {

  constructor(
    public http: Http,
    private storage: Storage,
  ) {
    console.log('Hello GameCreationService Provider');
  }

  loadData(dbVersion: VersionStored): Promise<any> {
    let env = this;

    return env.getVersion(dbVersion)
      .then((versionIsDifferent) => {
        if (versionIsDifferent) {
          return env.storeDataFromJson();
        } else {
          return Promise.resolve();
        }
      })
  }

  getVersion(version: VersionStored): Promise<boolean> {
    let env = this;

    return env.storage.get(version.key).then((versionValue) => {
      let versionIsDifferent = versionValue != version.value;
      let promise = Promise.resolve(versionIsDifferent);
      if (versionIsDifferent) {
        promise = env.storage.clear().then(() => {
          console.log("Database cleared.");
          return env.storage.set(version.key, version.value);
        }).then(() => {
          console.log("Database updated to version " + version.value);
          return versionIsDifferent;
        })
      } else {
        console.log("Database up to date already (v." + versionValue + ")");
      }
      return promise;
    });
  }

  storeDataFromJson(): Promise<any> {
    let env = this;

    console.log("Setting up database...");

    return env.http.get("assets/levels.json")
      .map(res => res.json().levels)
      .map((levelsData) => {
        let data = new Data(levelsData);
        return data.storeData(env.storage);
      })
      .toPromise();
  }

}
