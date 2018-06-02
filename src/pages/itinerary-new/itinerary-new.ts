import { Component } from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {ItineraryPage} from "../itinerary/itinerary";
import {ItineraryNewActivitiesPage} from "../itinerary-new-activities/itinerary-new-activities";
import {ItineraryStepPage} from "../itinerary-step/itinerary-step";

@Component({
  selector: 'page-itinerary-new',
  templateUrl: 'itinerary-new.html',
})
export class ItineraryNewPage {

  city: any;
  partenza: any;
  arrivo: any;
  dateStarts: '';
  timeStarts: '';
  puntiinteresse = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) {
    this.city = this.navParams.data.city;

  }

  ionViewDidLoad() {

  }

  filterActivityName (activityDisplayName): string {
    return activityDisplayName.split(",", 2)[0];
  }

  partenzaPressed() {
    const data = {
      city: this.city,
      multiple: false
    };
    const itineraryStepModal = this.modalCtrl.create(ItineraryNewActivitiesPage, data);
    itineraryStepModal.onDidDismiss(data => {
      this.partenza = data;
    });
    itineraryStepModal.present();
  }

  arrivoPressed() {
    const data = {
      city: this.city,
      multiple: false
    };
    const itineraryStepModal = this.modalCtrl.create(ItineraryNewActivitiesPage, data);
    itineraryStepModal.onDidDismiss(data => {
      this.arrivo = data;
    });
    itineraryStepModal.present();
  }

  puntiinteressePressed() {
    const data = {
      city: this.city,
      multiple: true
    };
    const itineraryStepModal = this.modalCtrl.create(ItineraryNewActivitiesPage, data);
    itineraryStepModal.onDidDismiss(data => {
      this.puntiinteresse = data;
    });
    itineraryStepModal.present();
  }

  onInviaPressed() {
    this.partenza.lat = this.partenza.geometry.coordinates[1];
    this.partenza.lon = this.partenza.geometry.coordinates[0];

    this.arrivo.lat = this.arrivo.geometry.coordinates[1];
    this.arrivo.lon = this.arrivo.geometry.coordinates[0];
    
    var visits = this.puntiinteresse.map(punto => punto.place_id);
    const createdItinerary = {
      display_name: "Itinerario personalizzato,",
      start_place: this.partenza,
      end_place: this.arrivo,
      displayDate: this.dateStarts + " " + this.timeStarts,
      visits: visits
    };
    this.navCtrl.push(ItineraryPage, {
      city: this.city,
      itinerary: createdItinerary
    });
  }
}
