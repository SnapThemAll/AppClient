import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Facebook} from "@ionic-native/facebook";
import {User} from "./user-data/user-data";


@Injectable()
export class FacebookService {

  FB_APP_ID: number = 216698218808232;

  constructor(
    private facebook: Facebook,
  ) {
    console.log('Hello FacebookService Provider');
    facebook.browserInit(this.FB_APP_ID, "v2.8");
  }


  login(): Promise<any> {
    let env = this;

    //the permissions your facebook app needs from the user
    let permissions = ["public_profile", "email", "user_friends"];

    return env.facebook.login(permissions)
      .then(function(response){
        //let userId = response.authResponse.userID;
        let params = [];
        let token = response.authResponse.accessToken;

        //Getting name property
        return env.requestAndSaveUserData(token, params)
      })
  }


  logout(): Promise<any>{
    let env = this;

    return env.facebook.logout()
      .then((response) => {
        //user logged out so we will remove him from the Storage
        // return env.userService.removeUser();
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  update(authToken: string): Promise<any> {
    let token = authToken;
    let params = [];

    return this.requestAndSaveUserData(token, params)
  }

  private requestAndSaveUserData(token: string, params: string[]): Promise<User>{
    let env = this;
    return env.facebook.api("/me?fields=id,name,friends{id,name}", params)
      .then((fbUser) => {

        return {
          id: fbUser.id,
          name: fbUser.name,
          pictureURL: "https://graph.facebook.com/" + fbUser.id + "/picture?type=large",
          authToken: token,
          friends: fbUser.friends.data.map((friend) => {
            return {
              id: friend.id,
              name: friend.name,
            };
          }).concat({
            id: fbUser.id,
            name: fbUser.name,
          }),
          totalCount: fbUser.friends.summary.total_count,
        };
      })
      .catch((error) => {
        console.log("An error occured during the facebook api call:" + JSON.stringify(error));
      });
  }
}
