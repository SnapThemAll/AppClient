import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import {Data, VersionStored} from "./start-up-data/load-data";
import {Storage} from "@ionic/storage";


@Injectable()
export class GameCreationService {

  constructor(
    private http: Http,
    private storage: Storage,
  ) {
    console.log('Hello GameCreationService Provider');
  }

  loadData(versionStorageKey: string, levelStorageKey: string): Promise<any> {
    let env = this;

    let version: Promise<VersionStored> = env.http.get("assets/levels.json")
      .map(res => {
        return {
          key: versionStorageKey,
          value: res.json().version
        }
      })
      .toPromise();

    return version.then((latestVersion) => {
      return env.checkVersionStored(latestVersion)
        .then((versionIsDifferent) => {
          if (versionIsDifferent) {
            return env.storeDataFromJson("assets/levels.json", levelStorageKey);
          } else {
            return Promise.resolve();
          }
        })
    })
  }

  checkVersionStored(version: VersionStored): Promise<boolean> {
    let env = this;

    return env.storage.get(version.key).then((versionValue) => {
      let versionIsDifferent = versionValue != version.value;
      let promise = Promise.resolve(versionIsDifferent);
      if (versionIsDifferent) {
        promise = env.storage.set(version.key, version.value)
          .then(() => {
            console.log("Database updated to version " + version.value);
            return versionIsDifferent;
          })
      } else {
        console.log("Database up to date already (v." + versionValue + ")");
      }
      return promise;
    });
  }

  storeDataFromJson(url: string, levelStorageKey: string): Promise<any> {
    let env = this;

    console.log("Setting up database...");

    return env.http.get(url)
      .map(res => res.json().levels)
      .map((levelsData) => {
        let data = new Data(levelStorageKey, levelsData);
        return data.storeData(env.storage);
      })
      .toPromise();
  }

}
