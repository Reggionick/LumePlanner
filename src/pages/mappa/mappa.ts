import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, MarkerCluster, MarkerOptions } from '@ionic-native/google-maps';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";
import { ActivityPage } from "../activity/activity";

@Component({
  selector: 'page-mappa',
  templateUrl: 'mappa.html',
})
export class MappaPage {

  mapReady: boolean = false;
  map: GoogleMap;

  city: any;
  selectedActivity: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public changeDetectorRef: ChangeDetectorRef,
    public lumeHttp: LumeHttpProvider
  ) {
    this.city = this.navParams.data;
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    // Create a map after the view is loaded.
    // (platform is already ready in app.component.ts)
    this.map = GoogleMaps.create('map_canvas', {
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

    // Wait the maps plugin is ready until the MAP_READY event
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.mapReady = true;
      this.mapReadyHandler();
      this.changeDetectorRef.detectChanges();
    });
  }

  mapReadyHandler() {
    this.map.moveCamera({
      target: {
        lng: (this.city.lonLatBBox[0]+this.city.lonLatBBox[2])/2,
        lat: (this.city.lonLatBBox[1]+this.city.lonLatBBox[3])/2
      },
      zoom: 13
    });

    this.lumeHttp.getActivities(this.city.name).subscribe((value: Array<any>) => {

      let data: Array<MarkerOptions> = [];

      for (let i = 0; i < value.length; i++) {
        data.push({
          position: {
            lng: value[i].geometry.coordinates[0],
            lat: value[i].geometry.coordinates[1]
          },
          title: value[i].display_name.split(',')[0],
          activity: value[i]
        });
      }

      this.map.addMarkerCluster({
        markers: data,
        icons: [
          {
            min: 2, max: 100,
            anchor: { x: 16, y: 16 },
            url: "assets/imgs/marker.png",
            label: { color: "white" }
          },
          {
            min: 100,
            anchor: { x: 16, y: 16 },
            url: "assets/imgs/marker.png",
            label: { color: "white" }
          }
        ]
      }).then((markerCluster: MarkerCluster) => {
        markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
          this.selectedActivity = params[1].get("activity");
          this.changeDetectorRef.detectChanges();
        });
      });
    }, error => {
      console.error(error);
    })
  }

  infoPressed () {
    if (this.selectedActivity) {
      this.navCtrl.push(ActivityPage, this.selectedActivity);
    }
  }

  vaiPressed () {
    if (this.selectedActivity) {
      const url = "https://www.google.com/maps/dir/?api=1&destination=" + this.selectedActivity.geometry.coordinates[1] + "," + this.selectedActivity.geometry.coordinates[0];
      window.open(url, "_system");
    }
  }

}
