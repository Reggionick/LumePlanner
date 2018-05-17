import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Spherical} from "@ionic-native/google-maps";

@Component({
  selector: 'page-my-trips-detail',
  templateUrl: 'my-trips-detail.html',
})
export class MyTripsDetailPage {

  itinerariesVisits: Array<any>;
  visitTolerance = 100;

  city: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.city = this.navParams.data.city;
    const checkUser = this.navParams.data.checkUser;
    this.itinerariesVisits = [];
    for (let k in checkUser.itineraries[this.city.name]) {
      this.itinerariesVisits.push({
        name: k,
        visits: this.checkItineraryVisits(checkUser, this.city.name, k)
      });
    }

  }

  ionViewDidLoad() {

  }


  checkItineraryVisits(data: any, cityName: string, itineraryKey: string) {
    const pois = data.itineraries[cityName][itineraryKey];
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
