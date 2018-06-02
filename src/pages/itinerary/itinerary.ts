import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import {GoogleMaps, GoogleMap, GoogleMapsEvent, MarkerCluster, MarkerOptions, Marker} from '@ionic-native/google-maps';
import * as moment from 'moment';

import {LumeHttpProvider} from "../../providers/lume-http/lume-http";

import {ItineraryStepPage} from "../itinerary-step/itinerary-step";

@Component({
  selector: 'page-itinerary',
  templateUrl: 'itinerary.html',
})
export class ItineraryPage {

  mapReady: boolean = false;
  map: GoogleMap;

  itinerary: any;
  city: any;
  plan: any;
  planType: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public lumeHttp: LumeHttpProvider
  ) {
    this.itinerary = this.navParams.data.itinerary;
    this.city = this.navParams.data.city;
    this.planType = 2;
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    // Create a map after the view is loaded.
    // (platform is already ready in app.component.ts)
    this.map = GoogleMaps.create('itinerary_map', {
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

    this.creaItinerario();
  }

  creaItinerario() {
    this.lumeHttp.getActivities(this.city.name).subscribe(
      (value: Array<any>)  => {

        let startActivity;
        for (let i = 0; i < value.length; i++) {
          const activity = value[i];
          if (activity.place_id === this.itinerary.visits[0]) {
            startActivity = activity;
            break;
          }
        }

        var place = {
          display_name: "0",
          place_id: "0",
          lat: startActivity.geometry.coordinates[1],
          lon: startActivity.geometry.coordinates[0]
        };

        const newplan = {
          city: this.city.name,
          start_time : this.itinerary.displayDate || moment().format('YYYY/MM/DD HH:mm:ss'),
          visits : this.itinerary.visits,
          start_place: this.itinerary.start_place || place,
          end_place : this.itinerary.end_place  || place,
        };

        this.lumeHttp.postPlan(newplan).subscribe(
          plan => {
            this.plan = plan;
            this.visualizzaItinerario(plan);
          }
        )
      }
    );
  }

  visualizzaItinerario(plan) {

    const currentPlan = plan.plans.shortest;

    this.map.addMarker({
      position: {
        lng: currentPlan.departure.geometry.coordinates[0],
        lat: currentPlan.departure.geometry.coordinates[1]
      },
      title: currentPlan.departure.display_name
    }).then((marker: Marker) => {});

    this.map.addMarker({
      position: {
        lng: currentPlan.arrival.geometry.coordinates[0],
        lat: currentPlan.arrival.geometry.coordinates[1]
      },
      title: currentPlan.arrival.display_name
    }).then((marker: Marker) => {});

    let visited: Array<MarkerOptions> = [];
    for (let i = 0; i < currentPlan.visited.length; i++) {
      visited.push({
        position: {
          lng: currentPlan.visited[i].visit.geometry.coordinates[0],
          lat: currentPlan.visited[i].visit.geometry.coordinates[1]
        },
        title: currentPlan.visited[i].visit.display_name.split(',')[0]
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
    for (let i = 0; i < currentPlan.to_visit.length; i++) {
      toVisit.push({
        position: {
          lng: currentPlan.to_visit[i].visit.geometry.coordinates[0],
          lat: currentPlan.to_visit[i].visit.geometry.coordinates[1]
        },
        title: currentPlan.to_visit[i].visit.display_name.split(',')[0]
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

  vaiPressed() {
    this.plan.selected = Object.keys(this.plan.plans)[this.planType];
    this.lumeHttp.postAcceptPlan(this.plan).subscribe(
      value => {
        if (value) {
          this.startItinerary();
        }
      }
    )
  }

  startItinerary() {
    const data = {
      city: this.city,
      plan: this.plan
    };
    const itineraryStepModal = this.modalCtrl.create(ItineraryStepPage, data);
    itineraryStepModal.onDidDismiss(data => {
      // this.navCtrl.popToRoot();
    });
    itineraryStepModal.present();
  }
}
