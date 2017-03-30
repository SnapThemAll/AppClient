import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { SettingsPage } from '../pages/settings/settings';
import { PlayPage } from '../pages/play/play';
import { TabsPage } from '../pages/tabs/tabs';
import { UserPage } from '../pages/user/user'
import { LoginPage } from '../pages/login/login'
import { LevelPage } from "../pages/level/level";
import { CardPage } from "../pages/card/card";
import { Storage } from "@ionic/storage";

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
    IonicModule.forRoot(MyApp)
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
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage]
})
export class AppModule {}
