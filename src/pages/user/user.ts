import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";
import {User} from "../../providers/user-data/user-data";

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})

export class UserPage {

  user: User;
  //userReady: boolean = false;

  constructor(
    public navCtrl: NavController,
    //public navParams: NavParams,
    public storage: Storage,
  ) {
    //this.user = navParams.get("user");
  }


  ionViewCanEnter(){
    let env = this;
    let nav = this.navCtrl;

    return env.storage.get('user')
      .then(function (data){
        env.user = data;
        //env.userReady = true;
        return true;
      }, function(error){ // not logged in
        console.log(error);
        nav.push(LoginPage)
      });
  }
}
