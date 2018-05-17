import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Spherical } from '@ionic-native/google-maps';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";
import {MyTripsDetailPage} from "../my-trips-detail/my-trips-detail";

@Component({
  selector: 'page-my-trips',
  templateUrl: 'my-trips.html',
})
export class MyTripsPage {

  cities: Array<any>;
  checkUser: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public lumeHttp: LumeHttpProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTripsPage');

    this.getUserItineraries();
  }

  getUserItineraries() {

    this.lumeHttp.getCities().subscribe(
      (cities: Array<any>) => {


        this.lumeHttp.getCheckuser().subscribe( (value: any) => {

          this.checkUser = value;

          this.cities = [];
          for (const city in value.itineraries) {
            for (let i = 0; i < cities.length; i++) {
              if (cities[i].name === city) {
                this.cities.push(cities[i]);
                break;
              }
            }
          }
        });
      }
    );
  }

  onCityClick(city: any) {
    this.navCtrl.push(MyTripsDetailPage, {
      city: city,
      checkUser: this.checkUser
    })
  }

}
