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
import { ActivitiesPage } from "../pages/activities/activities";
import { ActivityPage } from "../pages/activity/activity";
import { ItinerariesPage } from "../pages/itineraries/itineraries";
import { ItineraryPage } from "../pages/itinerary/itinerary";
import { ItineraryStepPage } from "../pages/itinerary-step/itinerary-step";
import { ItineraryBusPage } from "../pages/itinerary-bus/itinerary-bus";
import { ItineraryNewPage } from "../pages/itinerary-new/itinerary-new";
import { ItineraryNewActivitiesPage } from "../pages/itinerary-new-activities/itinerary-new-activities";
import { MyTripsPage } from '../pages/my-trips/my-trips';
import { MyTripsDetailPage } from "../pages/my-trips-detail/my-trips-detail";
import { UserPage } from '../pages/user/user';
import { HelpPage } from '../pages/help/help';
import { CreateTrackPage } from "../pages/create-track/create-track";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';

import { LumeHttpProvider } from '../providers/lume-http/lume-http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'http://5.144.174.222:8080/DITA/files/lang/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CityPage,
    MappaPage,
    ActivitiesPage,
    ActivityPage,
    ItinerariesPage,
    ItineraryPage,
    ItineraryStepPage,
    ItineraryBusPage,
    ItineraryNewPage,
    ItineraryNewActivitiesPage,
    MyTripsPage,
    MyTripsDetailPage,
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
    ActivitiesPage,
    ActivityPage,
    ItinerariesPage,
    ItineraryPage,
    ItineraryStepPage,
    ItineraryBusPage,
    ItineraryNewPage,
    ItineraryNewActivitiesPage,
    MyTripsPage,
    MyTripsDetailPage,
    UserPage,
    HelpPage,
    CreateTrackPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundGeolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LumeHttpProvider
  ]
})
export class AppModule {}
