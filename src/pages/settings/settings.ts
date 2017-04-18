import {Component} from "@angular/core";
import {LoginService} from "../../providers/login-service";
import {UserService} from "../../providers/user-service";
import {SocialSharingService} from "../../providers/social-sharing";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(
    public loginService: LoginService,
    public userService: UserService,
    public socialSharingService: SocialSharingService,
  ) {}

  ionViewDidEnter(){
    console.log("ionViewDidEnter Settings Page");
  }
}
