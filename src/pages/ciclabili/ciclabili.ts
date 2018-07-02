import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {LumeHttpProvider} from "../../providers/lume-http/lume-http";
import {CiclabileDetailPage} from "../ciclabile-detail/ciclabile-detail";

@Component({
  selector: 'page-ciclabili',
  templateUrl: 'ciclabili.html',
})
export class CiclabiliPage {

  city: any;
  itineraries = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public lumeHttp: LumeHttpProvider
  ) {

    this.city = this.navParams.data;

    this.lumeHttp.getGpxItineraries(this.city.name).subscribe((value: Array<any>) => {
      this.itineraries = value;
    })
  }

  ionViewDidLoad() {

  }

  onCiclabileClick (itinerary) {
    this.navCtrl.push(CiclabileDetailPage, {
      itinerary: itinerary,
      city: this.city
    });
  }

}
