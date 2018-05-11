import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {GoogleMap, GoogleMaps, GoogleMapsEvent} from "@ionic-native/google-maps";

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage {

  map: GoogleMap;

  activity: any;
  activityName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.activity = this.navParams.data;
    this.activityName = this.activity.display_name.split(",")[0];
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('activity_map', {
      controls: {
        myLocation: true,
        myLocationButton: true
      },
      camera: {
        target: {
          lng: this.activity.geometry.coordinates[0],
          lat: this.activity.geometry.coordinates[1]
        },
        zoom: 17
      }
    });

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.map.addMarker({
        position: {
          lng: this.activity.geometry.coordinates[0],
          lat: this.activity.geometry.coordinates[1]
        },
        title: this.activity.display_name
      });
    }) ;
  }

}
