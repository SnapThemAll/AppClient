import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {Facebook} from "@ionic-native/facebook";
import {User} from "./user-data/user-data";
import {UserService} from "./user-service";
import {ApiService} from "./api-service";


@Injectable()
export class FacebookService {

  FB_APP_ID: number = 216698218808232;

  constructor(
    private facebook: Facebook,
    private userService : UserService,
    private apiService : ApiService,
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

  update(): Promise<any> {
    let token = this.userService.user.authToken;
    let params = [];

    return this.requestAndSaveUserData(token, params)
  }


  private loadScores(): Promise<any>{
    let env = this;
    if(env.userService.user != null){
      let friends = env.userService.user.friends;
      return Promise.all(
        friends
          .map((friend) => friend.id)
          .map((id, index) =>
            env.apiService.getScore(id).toPromise()
              .then((res) => {
                friends[index].score = res.json().score;
              }))
      ).then(() => {
        let user = env.userService.user;
        user.friends = friends;
        return env.userService.save(user);
      });
    } else {
      return Promise.resolve();
    }
  }

  private requestAndSaveUserData(token: string, params: string[]): Promise<any>{
    let env = this;
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
              score: 0,
            };
          }),
          totalCount: fbUser.friends.summary.total_count,
        };

        return env.userService.save(user)
      })
      .then(() => env.apiService.fbAuth())
      .then(() => env.loadScores() )
      .catch((error) => {
        console.log("An error occured during the facebook api call:" + error);
      });
  }
}
