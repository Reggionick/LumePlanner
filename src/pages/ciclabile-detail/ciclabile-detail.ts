import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {CiclabilePage} from "../ciclabile/ciclabile";

@Component({
  selector: 'page-ciclabile-detail',
  templateUrl: 'ciclabile-detail.html',
})
export class CiclabileDetailPage {

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
    this.navCtrl.push(CiclabilePage,{
      itinerary: this.itinerary,
      city: this.city
    });
  }

}
