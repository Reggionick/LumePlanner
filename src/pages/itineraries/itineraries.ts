import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import {LocationService, MyLocation} from "@ionic-native/google-maps";

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

import { ItineraryDetailPage } from "../itinerary-detail/itinerary-detail";
import { ItineraryNewPage } from "../itinerary-new/itinerary-new";

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

    LocationService.getMyLocation({enableHighAccuracy: false}).then((myLocation: MyLocation) => {

      const lastPosition = {
        lat: myLocation.latLng.lat,
        lng: myLocation.latLng.lng
      };

      this.lumeHttp.getItineraries(this.city.name, lastPosition).subscribe((value: Array<any>) => {
        this.itineraries = value.map(itin => {
          const approx_time = itin.approx_time.split(" ", 2)[0];
          itin.approx_time = moment.duration(parseInt(approx_time) * 60 * 1000).locale("it").humanize();
          return itin;
        });
      })
    });
  }

  ionViewDidLoad() {

  }

  onItineraryClick (itinerary) {
    this.navCtrl.push(ItineraryDetailPage, {
      itinerary: itinerary,
      city: this.city
    });
  }

  addPlan () {
    this.navCtrl.push(ItineraryNewPage, {
      city: this.city
    });

  }
}
