import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { TranslateService } from "@ngx-translate/core";

import { HomePage } from '../pages/home/home';
import { MyTripsPage } from '../pages/my-trips/my-trips';
import { UserPage } from '../pages/user/user';
import { HelpPage } from '../pages/help/help';

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
    private backgroundGeolocation: BackgroundGeolocation,
    public  translate: TranslateService
  ) {
    this.initializeApp();
    this.initializeUser();

    translate.use('it');

    this.pages = [
      { title: 'MyTrips', translateKey: 'my_itineraries', component: MyTripsPage },
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
    this.nav.push(page.component).catch(err => console.log(err));
  }
}
