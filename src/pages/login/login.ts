import {Component} from "@angular/core";
import {Facebook} from "ionic-native";
import {NavController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {User} from "../../providers/user-data/user-data";
import {UserPage} from "../user/user";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  FB_APP_ID: number = 216698218808232;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
  ) {
  }


}
