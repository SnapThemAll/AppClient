import { Component } from '@angular/core';
import { Facebook } from 'ionic-native';
import { NavController } from 'ionic-angular';
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
    public storage: Storage
  ) {
    Facebook.browserInit(this.FB_APP_ID, "v2.8");
  }

  doFbLogin(){
    let nav = this.navCtrl;
    let storage = this.storage;
    let permissions = [];

    //the permissions your facebook app needs from the user
    permissions = ["public_profile", "user_friends"];

    Facebook.login(permissions)
      .then(function(response){
        //let userId = response.authResponse.userID;
        let params = [];

        //Getting name property
        Facebook.api("/me?fields=id,name,friends{id,name}", params)
          .then((fbUser) => {

            let user: User = {
              id : fbUser.id,
              name : fbUser.name,
              pictureURL : "https://graph.facebook.com/" + fbUser.id + "/picture?type=large",
              friends: fbUser.friends.data.map((friend) => {
                return {
                  id: friend.id,
                  name: friend.name,
                };
              })
            };

            storage.set("user", user)
              .then(() => {
                nav.push(UserPage, {
                  user: user
                });
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
    Facebook.logout()
      .then(function(response) {
        //user logged out so we will remove him from the Storage
        storage.remove('user').then(() => {
          alert("LOGGED OUT");
        })
      }, function(error){
        console.log(error);
        alert("ERROR");
      });
  }
}
