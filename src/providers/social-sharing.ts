import {Injectable} from "@angular/core";
import {SocialSharing} from "@ionic-native/social-sharing";

/*
  Generated class for the SocialSharingService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SocialSharingService {

  constructor(
    private socialSharing: SocialSharing,
  ) {
    console.log('Hello SocialSharingService Provider');
  }

  inviteFriends() {
    this.socialSharing.share(
      "message",
      "subject",
      null,
      "gregunz.io"
    )
  }
}