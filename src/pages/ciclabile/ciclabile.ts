import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, LatLngBounds} from "@ionic-native/google-maps";
import {parseString} from 'xml2js';

import {LumeHttpProvider} from "../../providers/lume-http/lume-http";

@Component({
  selector: 'page-ciclabile',
  templateUrl: 'ciclabile.html',
})
export class CiclabilePage {

  mapReady: boolean = false;
  map: GoogleMap;

  itinerary: any;
  city: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public lumeHttp: LumeHttpProvider
  ) {
    this.itinerary = this.navParams.data.itinerary;
    this.city = this.navParams.data.city;
  }

  ionViewDidLoad() {
    this.loadMap();

  }

  loadMap() {
    this.map = GoogleMaps.create('ciclabile_map', {
      controls: {
        myLocation: true,
        myLocationButton: true
      },
      camera: {
        target: {
          lng: 10.667276,
          lat: 44.687561
        },
        zoom: 8
      }
    });

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.mapReady = true;
      this.mapReadyHandler();
    });
  }

  mapReadyHandler() {

    this.addPathToMap();
  }

  addPathToMap() {

    this.lumeHttp.getGpxFile(this.city.name, this.itinerary.gpx).subscribe(value => {
      parseString(value, (err, result) => {
        const points = [];
        const bounds = new LatLngBounds();
        const pointsArray = result.gpx.trk[0].trkseg[0].trkpt;

        for (let i = 0; i < pointsArray.length; i++) {
          const p = new LatLng(pointsArray[i].$.lat, pointsArray[i].$.lon);
          points.push(p);
          bounds.extend(p);
        }

        this.map.addPolyline({
          points: points
        }).then(() => {
          this.map.moveCamera({
            target: bounds
          })
        })

      });
    })
  }

}
