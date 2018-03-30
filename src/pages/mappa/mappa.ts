import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MyLocation,
  MarkerClusterOptions
} from '@ionic-native/google-maps';
import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

@Component({
  selector: 'page-mappa',
  templateUrl: 'mappa.html',
})
export class MappaPage {

  mapReady: boolean = false;
  map: GoogleMap;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public lumeHttp: LumeHttpProvider
  ) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    // Create a map after the view is loaded.
    // (platform is already ready in app.component.ts)
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lng: 10.667276,
          lat: 44.687561
        },
        zoom: 15
      }
    });

    // Wait the maps plugin is ready until the MAP_READY event
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.mapReady = true;
      this.showUserLocation();
      this.mapReadyHandler();
    });
  }

  showUserLocation() {
    this.map.getMyLocation().then((location: MyLocation) => {
      return this.map.animateCamera({
        target: location.latLng,
        zoom: 15
      });
    });
  }

  mapReadyHandler() {
    console.log("mapReadyHandler");
    var city = window.localStorage.getItem('city');
    if (city || true) {
      city = "Reggio_nell'Emilia";
      this.lumeHttp.getActivities(city).subscribe((value: Array<any>) => {

        var data = [];

        for (var i = 0; i < value.length; i++) {
          data.push({
            position: {
              lng: value[i].geometry.coordinates[0],
              lat: value[i].geometry.coordinates[1]
            },
            title: value[i].display_name
          });
        }

        var markerClusterOptions: MarkerClusterOptions = {
          icons: [{min: 2, max: 100}, {min: 100, max: 200}, {min: 200, max: 500}, {min: 500, max: 1000}, {min: 1000, max: 2000}, {min: 2000}],
          markers: data
        };

        this.map.addMarkerCluster(markerClusterOptions);
      }, error => {
        console.error(error);
      })
    }
  }
}
