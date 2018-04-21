import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {GoogleMaps, GoogleMap, GoogleMapsEvent, BaseArrayClass, Spherical} from '@ionic-native/google-maps';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

@Component({
  selector: 'page-my-trips',
  templateUrl: 'my-trips.html',
})
export class MyTripsPage {

  map: GoogleMap;
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

    this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('my-trips-map', {
      camera: {
        target: {
          lng: 10.667276,
          lat: 44.687561
        },
        zoom: 8
      }
    });

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.getUserItineraries();
    });
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

        this.map.addPolyline({
          points: latlon,
          color: 'red',
          width: 3
        }).then(value1 => {
          this.map.animateCamera({
            target: {
              lng: value.latLon[0][1],
              lat: value.latLon[0][0]
            },
            zoom: 15
          });
        });

        let markers = [];

        for (let k in value.itineraries) {
          let pois = value.itineraries[k];

          for (let i = 0; i < pois.length; i++) {
            markers.push({
              position: {
                lng: pois[i].geometry.coordinates[0],
                lat: pois[i].geometry.coordinates[1]
              },
              title: pois[i].display_name
            });
          }
        }

        let baseArrayClass = new BaseArrayClass(markers);
        baseArrayClass.mapAsync((element) => {
          // this.map.addMarker(element);
        });

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
        coord: {
          lng: thisPoiCoord[0],
          lat: thisPoiCoord[1]
        }
      });
    }

    return result;
  }

  onItineraryClick(itinerary: any) {
    console.log("Should move to fit shape:", itinerary);
  }

  onItineraryPlaceClick(itinerary: any) {
    this.map.moveCamera({
      target: itinerary.coord,
      zoom: 16
    });
  }

}
