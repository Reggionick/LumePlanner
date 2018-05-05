import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Spherical } from '@ionic-native/google-maps';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

@Component({
  selector: 'page-my-trips',
  templateUrl: 'my-trips.html',
})
export class MyTripsPage {

  itinerariesVisits: Array<any>;
  visitTolerance = 100;

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

    this.lumeHttp.getCheckuser().subscribe( (value: any) => {

      if (value.latLon.length > 1) {

        let latlon = [];

        for (let i = 0; i < value.latLon.length; i++) {
          latlon.push({
            lng: value.latLon[i][1],
            lat: value.latLon[i][0]
          })
        }

        this.itinerariesVisits = [];
        for (let k in value.itineraries) {
          this.itinerariesVisits.push({
            name: k,
            visits: this.checkItineraryVisits(value, k)
          });
        }
      }

    });
  }

  checkItineraryVisits(data: any, itineraryKey: string) {
    const pois = data.itineraries[itineraryKey];
    let result = [];

    for (let i = 0; i < pois.length; i++) {
      const thisPoiCoord = pois[i].geometry.coordinates;
      let visited = false;
      for (let j = 0; j < data.latLon.length ; j++) {
        const dist = Spherical.computeDistanceBetween({lng: thisPoiCoord[0], lat: thisPoiCoord[1]}, {lng: data.latLon[j][1], lat: data.latLon[j][0]});

        if (dist < this.visitTolerance) {
          visited = true;
          break;
        }
      }
      result.push({
        visited: visited,
        displayName: pois[i].display_name,
        coord: {
          lng: thisPoiCoord[0],
          lat: thisPoiCoord[1]
        }
      });
    }

    return result;
  }
}
