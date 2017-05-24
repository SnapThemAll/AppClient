import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Player, User} from "./user-data/user-data";
import {Storage} from "@ionic/storage";
import {ApiService} from "./api-service";
import {FacebookService} from "./facebook-service";

@Injectable()
export class UserService {

  user: User;
  friendPlayers: Player[] = [];
  worldPlayers: Player[] = [];

  private userKeyToStore = "user";
  private friendPlayersKeyToStore = "friend-users";
  private worldPlayersKeyToStore = "world-users";

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
        return env.storage.get(env.friendPlayersKeyToStore)
      })
      .then((data) => {
        env.friendPlayers = data;
        return env.storage.get(env.worldPlayersKeyToStore)
      })
      .then((data) => {
        env.worldPlayers = data;
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

  saveFriendUsers(friendPlayers: Player[]): Promise<any>{
    let env = this;

    return env.storage.set(env.friendPlayersKeyToStore, friendPlayers)
      .then(() => {
        env.friendPlayers = friendPlayers;
      })
      .catch((error) => {
        console.log("An error occured during the storage of friend users:" + JSON.stringify(error));
      });
  }

  saveWorldUsers(worldPlayers: Player[]): Promise<any>{
    let env = this;

    return env.storage.set(env.worldPlayersKeyToStore, worldPlayers)
      .then(() => {
        env.worldPlayers = worldPlayers;
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
      .then((user) => env.saveUser(user))
      .then(() => env.updatePlayers())
      .catch((error) => console.log("Error while updating user service:" + JSON.stringify(error)));


  }

  updatePlayers(): Promise<any> {
    let env = this;
    return Promise.all(
      env.user.friends.concat({
        id: env.user.id,
        name: env.user.name,
      }).map((friend) =>
        env.apiService.getScore(friend.id).toPromise()
          .then((score) => {
            return {
              name: friend.name,
              score: score,
            }
          })
      )
    ).then((friendPlayers) => {
      env.saveFriendUsers(friendPlayers.sort((f1, f2) => f2.score - f1.score));
      return env.apiService.getWorldUsers().toPromise();
    }).then((worldPlayers) => env.saveWorldUsers(worldPlayers.sort((f1, f2) => f2.score - f1.score)))
      .catch((error) => console.log("Error while updating players:" + JSON.stringify(error)));
  }

}
