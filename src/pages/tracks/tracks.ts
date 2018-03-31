import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

@Component({
  selector: 'page-tracks',
  templateUrl: 'tracks.html',
})
export class TracksPage {

  itineraries: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public lumeHttp: LumeHttpProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TracksPage');

    const city = JSON.parse(window.localStorage.getItem("city"));
    const userCoordinates = {
      lat: 44.69914233260037,
      lng: 10.63091210096697
    };
    this.lumeHttp.getItineraries(city.name, userCoordinates).subscribe(value => {
      if (value){
        this.itineraries = value;
      }
    })
  }

  onItineraryClicked (itinerary) {
    console.log(JSON.stringify(itinerary));
  }

}
