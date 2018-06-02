import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

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

    this.lumeHttp.getItineraries(this.city.name, null).subscribe((value: Array<any>) => {
      this.itineraries = value.map(itin => {
        var approx_time = itin.approx_time.split(" ", 2)[0];
        itin.approx_time = moment.utc(parseInt(approx_time) * 60).format('HH:mm');
        return itin;
      });
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
