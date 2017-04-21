import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {User} from "./user-data/user-data";
import {Storage} from "@ionic/storage";

@Injectable()
export class UserService {

  user: User;

  userKeyToStore = "user";

  constructor(
    public storage: Storage,
  ) {
    console.log('Hello UserService Provider');
  }

  fetch(): Promise<User>{
    let env = this;

    return env.storage.get(env.userKeyToStore)
      .then((data) => {
        env.user = data;
        return env.user;
      })
      .catch((error) => {
        console.log("Error when retrieving user data from Storage:" + JSON.stringify(error));
      });
  }

  save(user: User): Promise<any>{
    let env = this;

    return this.storage.set(env.userKeyToStore, user)
      .then(() => {
        env.user = user;
      })
      .catch((error) => {
        console.log("An error occured during the storage of the logged user:" + JSON.stringify(error));
      });
  }

  remove(): Promise<any> {
    let env = this;
    return this.storage.remove(env.userKeyToStore).then(() => {
      console.log("User logged out");
      env.user = undefined;
    })
  }

}
