import {Component} from "@angular/core";
import {UserService} from "../../providers/user-service";
import {Player} from "../../providers/user-data/user-data";
import {SocialSharingService} from "../../providers/social-sharing";
import {Platform} from "ionic-angular";

@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html'
})
export class LeaderboardPage {

  worldPlayers: Player[] = [];
  friendPlayers: Player[] = [];

  worldSelected: boolean = true;

  constructor(
    private platform: Platform,
    private userService: UserService,
    private socialSharingService: SocialSharingService,
  ) {
    if(this.platform.is("cordova")) { //Trick so that ionic serve works
      this.friendPlayers = this.userService.friendPlayers;
      this.worldPlayers = this.userService.worldPlayers;
    }

    platform.registerBackButtonAction(() => {});
  }

  ionViewDidEnter(){
    console.log("ionViewDidEnter Leaderboard Page");
    this.update();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    let env = this;
    env.update()
      .then(() => refresher.complete());
  }

  inviteFriends() {
    this.socialSharingService.inviteFriends();
  }

  selectFriend() {
    this.worldSelected = false;
  }

  selectWorld() {
    this.worldSelected = true;
  }


  itemSelected(player: Player) {
    console.log("Selected Item :", player);
  }

  private update(): Promise<any> {
    let env = this;
    if (env.platform.is("cordova")) { //Trick so that "ionic serve" works
      console.log("Updating users and players");
      return env.userService.update()
        .then(() => {
          env.friendPlayers = env.userService.friendPlayers;
          env.worldPlayers = env.userService.worldPlayers;
        });
    } else {
      return Promise.resolve()
    }
  }


}
