import {Component} from "@angular/core";
import {UserService} from "../../providers/user-service";
import {FriendUser, WorldUser} from "../../providers/user-data/user-data";
import {SocialSharingService} from "../../providers/social-sharing";
import {Platform} from "ionic-angular";

@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html'
})
export class LeaderboardPage {

  friendUsers: FriendUser[] = [];
  worldUsers: WorldUser[] = [];

  constructor(
    private platform: Platform,
    private userService: UserService,
    private socialSharingService: SocialSharingService,
  ) {
    if(!this.platform.is("mobileweb")) { //Trick so that ionic serve works
      this.friendUsers = this.userService.friendUsers;
      this.worldUsers = this.userService.worldUsers;
    }

    platform.registerBackButtonAction(() => {})
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


  itemSelected(worldUser: WorldUser) {
    console.log("Selected Item :", worldUser);
  }

  private update(): Promise<any> {
    if (!this.platform.is("mobileweb")) { //Trick so that ionic serve works
      return this.userService.update();
    } else {
      return Promise.resolve()
    }
  }


}
