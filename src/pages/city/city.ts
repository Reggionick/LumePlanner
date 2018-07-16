import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {MappaPage} from "../mappa/mappa";
import {ItinerariesPage} from "../itineraries/itineraries";
import {CiclabiliPage} from "../ciclabili/ciclabili";
import {ActivitiesPage} from "../activities/activities";

@Component({
  selector: 'page-city',
  templateUrl: 'city.html',
})
export class CityPage {

  city: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.city = this.navParams.data;
  }

  ionViewDidLoad() {
  }

  menuElementPressed(el: string) {

    switch (el) {

      case "mappa":
        this.navCtrl.push(MappaPage, this.city);
        break;

      case "itinerari":
        this.navCtrl.push(ItinerariesPage, this.city);
        break;

      case "ciclabili":
        this.navCtrl.push(CiclabiliPage, {
          city: this.city,
          type: "itineraries"
        });
        break;

      case "itinerariaccessibili":
        this.navCtrl.push(CiclabiliPage, {
          city: this.city,
          type: "itineraries_disabili"
        });
        break;

      case "cosedavedere":
      case "preferiti":
      case "celiachia":
      case "resting":
      case "eating":
      case "fashion":
      case "artigianato":
        this.navCtrl.push(ActivitiesPage, {
          city: this.city,
          filter: el
        });
        break;
    }
  }

}
