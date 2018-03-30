import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { MappaPage } from '../pages/mappa/mappa';
import { MyTripsPage } from '../pages/my-trips/my-trips';
import { TracksPage } from '../pages/tracks/tracks';
import { UserPage } from '../pages/user/user';
import { HelpPage } from '../pages/help/help';
import { TranslateService } from "@ngx-translate/core";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, translateKey: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public  translate: TranslateService
  ) {
    this.initializeApp();
    this.initializeUser();

    translate.use('it');

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', translateKey: 'homepage', component: HomePage },
      { title: 'Mappa', translateKey: 'my_places', component: MappaPage },
      { title: 'MyTrips', translateKey: 'my_itineraries', component: MyTripsPage },
      { title: 'Tracks', translateKey: 'itineraries', component: TracksPage },
      { title: 'User', translateKey: 'user', component: UserPage },
      { title: 'resting', translateKey: 'help', component: HelpPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initializeUser() {
    let user = ("" + Math.random()).substring(2);
    window.localStorage.setItem("user", user);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
