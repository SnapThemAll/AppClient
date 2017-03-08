import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { SettingsPage } from '../pages/settings/settings';
import { PlayPage } from '../pages/play/play';
import { TabsPage } from '../pages/tabs/tabs';
import {LevelPage} from "../pages/level/level";
import {Storage} from "@ionic/storage";

@NgModule({
  declarations: [
    MyApp,
    LeaderboardPage,
    SettingsPage,
    PlayPage,
    TabsPage,
    LevelPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LeaderboardPage,
    SettingsPage,
    PlayPage,
    TabsPage,
    LevelPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage]
})
export class AppModule {}
