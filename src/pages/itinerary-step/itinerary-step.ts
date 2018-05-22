import { Component } from '@angular/core';
import { AlertController, ModalController, NavParams, ViewController } from 'ionic-angular';
import { GoogleMap, GoogleMaps, GoogleMapsEvent, ILatLng, LocationService, Marker, MarkerCluster, MarkerOptions, MyLocation, Polyline, PolylineOptions } from "@ionic-native/google-maps";
import {BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse} from "@ionic-native/background-geolocation";

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

import { ItineraryBusPage } from "../itinerary-bus/itinerary-bus";

@Component({
  selector: 'page-itinerary-step',
  templateUrl: 'itinerary-step.html',
})
export class ItineraryStepPage {

  mapReady: boolean = false;
  map: GoogleMap;
  nextStepLabel = "Prossima";

  city: any;
  plan: any;
  itineraryType: any;
  itinerary: any;
  nextActivity: any;
  currentPath: PolylineOptions;
  currentPolyline: Polyline;
  lastPosition: {lat: number, lon: number};

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public backgroundGeolocation: BackgroundGeolocation,
    public lumeHttp: LumeHttpProvider
  ) {
    this.city = this.navParams.data.city;
    this.plan = this.navParams.data.plan;
    this.itineraryType = this.plan.selected;
    this.itinerary = this.plan.plans[this.itineraryType];
  }

  ionViewDidLoad() {
    this.loadMap();

    LocationService.getMyLocation({enableHighAccuracy: true}).then((myLocation: MyLocation) => {

      this.lastPosition = {
        lat: myLocation.latLng.lat,
        lon: myLocation.latLng.lng
      };
      this.goToNextStep();

    });

    this.initializeBackgroundGeolocation();

  }

  dismiss() {
    let prompt = this.alertCtrl.create({
      // title: 'Login',
      message: "Vuoi abbandonare?",//TODO: translate
      buttons: [
        {
          text: 'Annulla'//TODO: translate
        },
        {
          text: 'Abbandona',//TODO: translate
          handler: data => {
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    prompt.present();
  }

  loadMap() {
    this.map = GoogleMaps.create('itinerarystep_map', {
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

    this.addItineraryActivities();
    this.addPathToMap();
  }

  initializeBackgroundGeolocation() {

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    };

    this.backgroundGeolocation.configure(config)
      .subscribe((location: BackgroundGeolocationResponse) => {

        console.log(JSON.stringify(location));
        this.lastPosition = {
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        };
        this.reloadRoute();

        this.backgroundGeolocation.finish();

      });

    this.backgroundGeolocation.start();
  }

  goToNextStep() {

    if (this.itinerary.visited === null || this.itinerary.visited.length === 0) {
      this.nextActivity = this.itinerary.to_visit[0].visit;
    }
    else if (this.itinerary.to_visit.length > 0) {
      this.nextActivity = this.itinerary.to_visit[0].visit;
    }
    else {
      this.nextActivity = this.itinerary.arrival;
    }

    if (this.nextActivity == this.itinerary.arrival) {
      this.nextStepLabel = "Fine"; //TODO: transalte
    }

    this.reloadRoute();
  }

  reloadRoute() {

    const destinationCoordinates = {
      lat: this.nextActivity.geometry.coordinates[1],
      lon: this.nextActivity.geometry.coordinates[0]
    };

    this.lumeHttp.getRoute(this.lastPosition, destinationCoordinates).subscribe(
      (value: any) => {
        let points: Array<ILatLng> = [];

        for (let i = 0; i < value.points.coordinates.length; i++) {
          points.push({
            lat: value.points.coordinates[i][1],
            lng: value.points.coordinates[i][0]
          })
        }

        this.currentPath = {
          points: points
        };

        if (this.mapReady) {
          this.addPathToMap();
        }

      }
    );

  }

  busPressed() {

    const itineraryStepModal = this.modalCtrl.create(ItineraryBusPage, {
      partenza: this.lastPosition,
      arrivo: this.nextActivity
    });
    itineraryStepModal.onDidDismiss(data => {
      // this.navCtrl.popToRoot();
    });
    itineraryStepModal.present();
  }

  prossimaPressed() {

    if (this.nextActivity == this.itinerary.arrival) {
      let prompt = this.alertCtrl.create({
        message: "Itinerario completato!",//TODO: translate
        buttons: [
          {
            text: 'Condividi',//TODO: translate
            handler: data => {

            }
          },
          {
            text: 'Chiudi',//TODO: translate
            handler: data => {
              this.viewCtrl.dismiss();
            }
          }
        ]
      });
      prompt.present();
    } else {
      this.lumeHttp.postVisit(this.city.name, this.nextActivity).subscribe(
        value => {
          console.log("postVisit: " + JSON.stringify(value));
          this.plan = value;
          this.itinerary = this.plan.plans[this.itineraryType];
          this.goToNextStep();

        }
      );
    }
  }

  addItineraryActivities() {

    this.map.addMarker({
      position: {
        lng: this.itinerary.departure.geometry.coordinates[0],
        lat: this.itinerary.departure.geometry.coordinates[1]
      },
      title: this.itinerary.departure.display_name
    }).then((marker: Marker) => {});

    this.map.addMarker({
      position: {
        lng: this.itinerary.arrival.geometry.coordinates[0],
        lat: this.itinerary.arrival.geometry.coordinates[1]
      },
      title: this.itinerary.arrival.display_name
    }).then((marker: Marker) => {});

    let visited: Array<MarkerOptions> = [];
    for (let i = 0; i < this.itinerary.visited.length; i++) {
      visited.push({
        position: {
          lng: this.itinerary.visited[i].visit.geometry.coordinates[0],
          lat: this.itinerary.visited[i].visit.geometry.coordinates[1]
        },
        title: this.itinerary.visited[i].visit.display_name.split(',')[0]
      });
    }
    this.map.addMarkerCluster({
      markers: visited,
      icons: [
        {
          min: 1, max: 1000,
          anchor: { x: 16, y: 16 },
          url: "./assets/markercluster/small.png",
          label: { color: "white" }
        }
      ]
    }).then((markerCluster: MarkerCluster) => {});

    let toVisit: Array<MarkerOptions> = [];
    for (let i = 0; i < this.itinerary.to_visit.length; i++) {
      toVisit.push({
        position: {
          lng: this.itinerary.to_visit[i].visit.geometry.coordinates[0],
          lat: this.itinerary.to_visit[i].visit.geometry.coordinates[1]
        },
        title: this.itinerary.to_visit[i].visit.display_name.split(',')[0]
      });
    }
    this.map.addMarkerCluster({
      markers: toVisit,
      icons: [
        {
          min: 1, max: 1000,
          anchor: { x: 16, y: 16 },
          url: "./assets/markercluster/small.png",
          label: { color: "white" }
        }
      ]
    }).then((markerCluster: MarkerCluster) => {});

  }

  addPathToMap() {
    if (this.currentPolyline) {
      this.currentPolyline.remove();
    }

    this.map.addPolyline(this.currentPath).then(
      (polyline: Polyline) => {
        this.currentPolyline = polyline;

        this.map.moveCamera({
          target: this.currentPath.points
        });
      }
    )
  }

}
