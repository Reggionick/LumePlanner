import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {MappaPage} from "../mappa/mappa";

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

      case "cosedavedere":
      case "itinerari":
      case "preferiti":
      case "itinerariaccessibili":
      case "ciclabili":
      case "glutenfree":
      case "resting":
      case "eating":
      case "fashion":
      case "artigianato":
        // this.navCtrl.push(MappaPage, {
        //   city: this.city,
        //   filter: el
        // });
        break;
    }
  }

}
