import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {User} from "../../providers/user-data/user-data";
import {Facebook} from "ionic-native";

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})

export class UserPage {

  user: User;
  FB_APP_ID: number = 216698218808232;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
  ) {
  }

  ionViewDidEnter() {
    this.retrieveUser();
  }

  retrieveUser() {
    let env = this;

    env.storage.get('user')
      .then(function (data){
        env.user = data;
        if(data){
          Facebook.browserInit(this.FB_APP_ID, "v2.8");
        }
      }, function(error){
        console.log("Error when retrieving user data from Storage:" + error);
      });
  }

  isLoggedIn(): boolean {
    return this.user != null;
  }


  doFbLogin(){
    let env = this;
    //let nav = this.navCtrl;
    let storage = this.storage;

    //the permissions your facebook app needs from the user
    let permissions = ["public_profile", "user_friends"];

    Facebook.login(permissions)
      .then(function(response){
        //let userId = response.authResponse.userID;
        let params = [];
        let token = response.authResponse.accessToken;

        //Getting name property
        Facebook.api("/me?fields=id,name,friends{id,name}", params)
          .then((fbUser) => {

            let user: User = {
              id : fbUser.id,
              name : fbUser.name,
              pictureURL : "https://graph.facebook.com/" + fbUser.id + "/picture?type=large",
              authToken: token,
              friends: fbUser.friends.data.map((friend) => {
                return {
                  id: friend.id,
                  name: friend.name,
                };
              })
            };

            storage.set("user", user)
             .then(() => {
              env.retrieveUser();
             })
              .catch((error) => {
                console.log("An error occured during the storage of the logged user:" + error);
              });
          })
          .catch((error) => {
            console.log("An error occured during the facebook api call:" + error);
          });
      })
      .catch((error) => {
        console.log("An error occured during the facebook login:" + error);
      });
  }

  doFbLogout(){
    let storage = this.storage;
    let env = this;

    Facebook.logout()
      .then(function(response) {
        //user logged out so we will remove him from the Storage
        storage.remove('user').then(() => {
          env.retrieveUser();
        })
      }, function(error){
        console.log(error);
      });
  }
}
