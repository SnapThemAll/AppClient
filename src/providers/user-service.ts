import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {FriendUser, User, WorldUser} from "./user-data/user-data";
import {Storage} from "@ionic/storage";
import {ApiService} from "./api-service";
import {FacebookService} from "./facebook-service";

@Injectable()
export class UserService {

  user: User;
  friendUsers: FriendUser[];
  worldUsers: WorldUser[];

  private userKeyToStore = "user";
  private friendUsersKeyToStore = "friend-users";
  private worldUsersKeyToStore = "world-users";

  constructor(
    private storage: Storage,
    private apiService: ApiService,
    private facebookService: FacebookService,
  ) {
    console.log('Hello UserService Provider');
  }

  fetch(): Promise<any>{
    let env = this;

    return env.storage.get(env.userKeyToStore)
      .then((data) => {
        env.user = data;
        return env.storage.get(env.friendUsersKeyToStore)
      })
      .then((data) => {
        env.friendUsers = data;
        return env.storage.get(env.worldUsersKeyToStore)
      })
      .then((data) => {
        env.worldUsers = data;
      })
      .catch((error) => {
        console.log("Error when retrieving user data from Storage:" + JSON.stringify(error));
      });
  }

  saveUser(user: User): Promise<any>{
    let env = this;

    return env.storage.set(env.userKeyToStore, user)
      .then(() => {
        env.user = user;
      })
      .catch((error) => {
        console.log("An error occured during the storage of the logged user:" + JSON.stringify(error));
      });
  }

  saveFriendUsers(friendUsers: FriendUser[]): Promise<any>{
    let env = this;

    return env.storage.set(env.friendUsersKeyToStore, friendUsers)
      .then(() => {
        env.friendUsers = friendUsers;
      })
      .catch((error) => {
        console.log("An error occured during the storage of friend users:" + JSON.stringify(error));
      });
  }

  saveWorldUsers(worldUsers: WorldUser[]): Promise<any>{
    let env = this;

    return env.storage.set(env.worldUsersKeyToStore, worldUsers)
      .then(() => {
        env.worldUsers = worldUsers;
      })
      .catch((error) => {
        console.log("An error occured during the storage of world users:" + JSON.stringify(error));
      });
  }

  removeUser(): Promise<any> {
    let env = this;
    return this.storage.remove(env.userKeyToStore).then(() => {
      console.log("User logged out");
      env.user = undefined;
    })
  }

  update(): Promise<any> {
    let env = this;
    return env.facebookService.update(env.user.authToken) // this update user (from facebook)
      .then(() =>
        Promise.all(
          env.user.friends.map((friend) =>
            env.apiService.getScore(friend.id).toPromise()
              .then((res) => {
                return {
                  id: friend.id,
                  name: friend.name,
                  score: res.json().score,
                }
              })
          )
        )
      ).then((friendUsers) => {
        env.saveFriendUsers(friendUsers.sort((f1, f2) => f2.score - f1.score));
        return env.apiService.getWorldUsers().toPromise();
      })
      .then((worldUsers) => env.saveWorldUsers(worldUsers.sort((f1, f2) => f2.score - f1.score)));
  }

}
