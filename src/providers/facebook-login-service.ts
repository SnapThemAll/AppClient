import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Facebook} from "@ionic-native/facebook";
import {User} from "./user-data/user-data";
import {UserService} from "./user-service";
import {CardService} from "./card-service";


@Injectable()
export class FacebookLoginService {

  FB_APP_ID: number = 216698218808232;

  constructor(
    private facebook: Facebook,
    private userService : UserService,
    private cardService : CardService,
  ) {
    console.log('Hello FacebookLoginService Provider');
    facebook.browserInit(this.FB_APP_ID, "v2.8");
  }


  login(): Promise<any> {
    let env = this;

    //the permissions your facebook app needs from the user
    let permissions = ["public_profile", "user_friends"];

    return env.facebook.login(permissions)
      .then(function(response){
        //let userId = response.authResponse.userID;
        let params = [];
        let token = response.authResponse.accessToken;

        //Getting name property
        return env.facebook.api("/me?fields=id,name,friends{id,name}", params)
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

            return env.userService.save(user).then(() => env.cardService.fbAuth());
          })
          .catch((error) => {
            console.log("An error occured during the facebook api call:" + error);
          });
      })
      .catch((error) => {
        console.log("An error occured during the facebook login:" + error);
      });
  }


  logout(): Promise<any>{
    let env = this;

    return env.facebook.logout()
      .then((response) => {
        //user logged out so we will remove him from the Storage
        return env.userService.remove();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  isLoggedIn(): boolean {
    return this.userService.user != null;
  }

}
