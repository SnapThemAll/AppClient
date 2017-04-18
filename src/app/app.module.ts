import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {LeaderboardPage} from "../pages/leaderboard/leaderboard";
import {SettingsPage} from "../pages/settings/settings";
import {PlayPage} from "../pages/play/play";
import {TabsPage} from "../pages/tabs/tabs";
import {UserPage} from "../pages/user/user";
import {LoginPage} from "../pages/login/login";
import {LevelPage} from "../pages/level/level";
import {CardPage} from "../pages/card/card";
import {IonicStorageModule } from "@ionic/storage";
import {UserService} from "../providers/user-service";
import {FacebookService} from "../providers/facebook-service";
import {ApiService} from "../providers/api-service";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SocialSharing} from "@ionic-native/social-sharing";
import {StatusBar} from "@ionic-native/status-bar";
import {Facebook} from "@ionic-native/facebook";
import {Camera} from "@ionic-native/camera";
import {File} from "@ionic-native/file";
import {Transfer} from "@ionic-native/transfer";
import {GameCreationService} from "../providers/game-creation-service";
import {LevelsService} from "../providers/levels-service";
import {LoginService} from "../providers/login-service";
import {SocialSharingService} from "../providers/social-sharing";


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LeaderboardPage,
    SettingsPage,
    PlayPage,
    LevelPage,
    CardPage,
    UserPage,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LeaderboardPage,
    SettingsPage,
    PlayPage,
    LevelPage,
    CardPage,
    UserPage,
    LoginPage,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StatusBar,
    SplashScreen,
    Facebook,
    Camera,
    File,
    Transfer,
    SocialSharing,
    UserService,
    FacebookService,
    ApiService,
    GameCreationService,
    LevelsService,
    LoginService,
    SocialSharingService,
  ]
})
export class AppModule {}
