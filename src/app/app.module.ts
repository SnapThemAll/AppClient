import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {LeaderboardPage} from "../pages/leaderboard/leaderboard";
import {SettingsPage} from "../pages/settings/settings";
import {PlayPage} from "../pages/play/play";
import {TabsPage} from "../pages/tabs/tabs";
import {LoginPage} from "../pages/login/login";
import {LevelPage} from "../pages/level/level";
import {CardPage} from "../pages/card/card";
import {IonicStorageModule} from "@ionic/storage";
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
import {LoginService} from "../providers/login-service";
import {SocialSharingService} from "../providers/social-sharing";
import {GameStorageService} from "../providers/game-storage-service";
import {CameraService} from "../providers/camera-service";
import {FileManager} from "../providers/file-manager";
import {ToastService} from "../providers/toast-service";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {FeedbackPage} from "../pages/feedback/feedback/feedback";
import {AutosizeDirective} from "../directives/autosize/autosize";


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LeaderboardPage,
    SettingsPage,
    PlayPage,
    LevelPage,
    CardPage,
    TutorialPage,
    FeedbackPage,
    LoginPage,
    AutosizeDirective,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    TabsPage,
    LeaderboardPage,
    SettingsPage,
    PlayPage,
    LevelPage,
    CardPage,
    TutorialPage,
    FeedbackPage,
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
    ApiService,
    CameraService,
    GameCreationService,
    GameStorageService,
    FacebookService,
    LoginService,
    SocialSharingService,
    UserService,
    FileManager,
    ToastService,
  ]
})
export class AppModule {}
