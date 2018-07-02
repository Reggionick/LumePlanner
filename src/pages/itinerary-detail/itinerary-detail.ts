import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ItineraryPage} from "../itinerary/itinerary";

@Component({
  selector: 'page-itinerary-detail',
  templateUrl: 'itinerary-detail.html',
})
export class ItineraryDetailPage {

  itinerary: any;
  city: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.itinerary = this.navParams.data.itinerary;
    this.city = this.navParams.data.city;
  }

  ionViewDidLoad() {

  }


  onVaiPressed () {
    this.navCtrl.push(ItineraryPage, {
      itinerary: this.itinerary,
      city: this.city
    });
  }

}
