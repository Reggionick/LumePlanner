import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

import { ItineraryPage } from "../itinerary/itinerary";

@Component({
  selector: 'page-itineraries',
  templateUrl: 'itineraries.html',
})
export class ItinerariesPage {

  city: any;
  itineraries: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public lumeHttp: LumeHttpProvider
  ) {

    this.city = this.navParams.data;

    this.lumeHttp.getItineraries(this.city.name, null).subscribe(value => {
      this.itineraries = value;
    })

  }

  ionViewDidLoad() {

  }

  onItineraryClick (itinerary) {
    this.navCtrl.push(ItineraryPage, {
      itinerary: itinerary,
      city: this.city
    });
  }
}
