import {Component} from "@angular/core";
import {PlayPage} from "../play/play";
import {LeaderboardPage} from "../leaderboard/leaderboard";
import {UserPage} from "../user/user";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = LeaderboardPage;
  tab2Root: any = PlayPage;
  tab3Root: any = UserPage;

  constructor() {
  }
}
