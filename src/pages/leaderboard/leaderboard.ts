import {Component} from "@angular/core";
import {UserService} from "../../providers/user-service";
import {Friend} from "../../providers/user-data/user-data";
import {SocialSharingService} from "../../providers/social-sharing";
import {FacebookService} from "../../providers/facebook-service";
import {GameStorageService} from "../../providers/game-storage-service";

@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html'
})
export class LeaderboardPage {

  friends: Friend[] = [];

  constructor(
    private facebookService: FacebookService,
    private userService: UserService,
    public socialSharingService: SocialSharingService,
    private gameStorageService: GameStorageService,
  ) {
    this.loadFriends();
  }


  ionViewDidEnter(){
    console.log("ionViewDidEnter Leaderboard Page");
    this.loadFriends();
  }

  loadFriends(){
    if(this.userService.user != null) {
      let user = this.userService.user;
      this.friends = user.friends.concat({
        id: user.id,
        name: user.name,
        score: this.gameStorageService.game.totalScore(),
      }).sort((f1, f2) => f2.score - f1.score)
    }
  }


  itemSelected(friend: Friend) {
    console.log("Selected Item :", friend);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    let env = this;
    env.facebookService.update()
      .then(() => {
        env.loadFriends();
        refresher.complete();
      });
  }

}
