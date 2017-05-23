import {Component} from "@angular/core";
import {UserService} from "../../providers/user-service";
import {WorldUsersService} from "../../providers/world-users-service";
import {Friend, WorldUser} from "../../providers/user-data/user-data";
import {SocialSharingService} from "../../providers/social-sharing";
import {FacebookService} from "../../providers/facebook-service";
import {GameStorageService} from "../../providers/game-storage-service";
import {Platform} from "ionic-angular";
import {ApiService} from "../../providers/api-service";

@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html'
})
export class LeaderboardPage {

  friends: Friend[] = [];
  worldUsers: WorldUser[] = [];

  constructor(
    private platform: Platform,
    private facebookService: FacebookService,
    private apiService: ApiService,
    private userService: UserService,
    private worldUsersService: WorldUsersService,
    public socialSharingService: SocialSharingService,
    private gameStorageService: GameStorageService,
  ) {
    this.loadData();

    platform.registerBackButtonAction(() => {})
  }

  ionViewDidEnter(){
    console.log("ionViewDidEnter Leaderboard Page");
    this.loadData();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    let env = this;
    env.loadData()
      .then(() => refresher.complete());
  }


  itemSelected(friend: Friend) {
    console.log("Selected Item :", friend);
  }

  private loadData(): Promise<any> {
    let env = this;
    if(env.userService.user != null){
      return env.facebookService.update()
        .then(() => env.updateWorldUsers())
        .then(() => {
          env.loadFriends();
          env.loadWorldUsers();
        });
    } else {
      return Promise.resolve();
    }
  }

  private updateWorldUsers(): Promise<any> {
    let env = this;
    return env.apiService.getWorldUsers().toPromise()
      .then((worldUsers: WorldUser[]) =>
        env.worldUsersService.save(worldUsers)
      )
  }

  private loadFriends(){
    if(this.userService.user != null) {
      this.friends = this.userService.user.friends
        .sort((f1, f2) => f2.score - f1.score)
    }
  }

  private loadWorldUsers(){
    if(this.worldUsersService.worldUsers != null) {
      this.worldUsers = this.worldUsersService.worldUsers
        .sort((f1, f2) => f2.score - f1.score)
    }
  }


}
