import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {WorldUser} from "./user-data/user-data";
import {Storage} from "@ionic/storage";

@Injectable()
export class WorldUsersService {

  worldUsers: WorldUser[];

  worldUsersKeyToStore = "world-users";

  constructor(
    public storage: Storage,
  ) {
    console.log('Hello WorldUsersService Provider');
  }

  fetch(): Promise<WorldUser[]>{
    let env = this;

    return env.storage.get(env.worldUsersKeyToStore)
      .then((data) => {
        env.worldUsers = data;
        return env.worldUsers;
      })
      .catch((error) => {
        console.log("Error when retrieving worldUsers data from Storage:" + JSON.stringify(error));
      });
  }

  save(worldUsers: WorldUser[]): Promise<any>{
    let env = this;

    return this.storage.set(env.worldUsersKeyToStore, worldUsers)
      .then(() => {
        env.worldUsers = worldUsers;
      })
      .catch((error) => {
        console.log("An error occured during the storage of the worldUsers:" + JSON.stringify(error));
      });
  }

  remove(): Promise<any> {
    let env = this;
    return this.storage.remove(env.worldUsersKeyToStore).then(() => {
      console.log("WorldUsers removed");
      env.worldUsers = undefined;
    })
  }

}
