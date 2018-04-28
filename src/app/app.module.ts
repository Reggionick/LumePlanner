import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CityPage } from "../pages/city/city";
import { MappaPage } from '../pages/mappa/mappa';
import { MyTripsPage } from '../pages/my-trips/my-trips';
import { TracksPage } from '../pages/tracks/tracks';
import { UserPage } from '../pages/user/user';
import { HelpPage } from '../pages/help/help';
import { CreateTrackPage } from "../pages/create-track/create-track";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EmailComposer } from '@ionic-native/email-composer';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';

import { LumeHttpProvider } from '../providers/lume-http/lume-http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'http://lume.morselli.unimore.it/DITA/files/lang/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CityPage,
    MappaPage,
    MyTripsPage,
    TracksPage,
    UserPage,
    HelpPage,
    CreateTrackPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CityPage,
    MappaPage,
    MyTripsPage,
    TracksPage,
    UserPage,
    HelpPage,
    CreateTrackPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EmailComposer,
    BackgroundGeolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LumeHttpProvider
  ]
})
export class AppModule {}
