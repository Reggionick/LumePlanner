import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

import {LumeHttpProvider} from "../../providers/lume-http/lume-http";

@Component({
  selector: 'page-itinerary-new-activities',
  templateUrl: 'itinerary-new-activities.html',
})
export class ItineraryNewActivitiesPage {
  city: any;
  multiple: boolean;

  allActivities = [];
  activities = [];
  favourites = {};

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public lumeHttp: LumeHttpProvider
  ) {
    this.city = this.navParams.data.city;
    this.multiple = this.navParams.data.multiple;

    const placeholders = {
      resting: "assets/imgs/resting-pin-b.svg",
      attractions: "assets/imgs/actraction-b.svg",
      tree: "assets/imgs/tree-pin-b.svg",
      lifestyle: "assets/imgs/lifestile-pin-b.svg",
      eating: "assets/imgs/eating-pin-b.svg",
      parks: "assets/imgs/park-pin.svg"
    };

    this.lumeHttp.getActivities(this.city.name).subscribe(
      (value: any) => {

        this.allActivities = value;
        this.activities = this.allActivities;
      }
    )
  }

  ionViewDidLoad() {

  }

  getFilteredActivities (ev: any) {
    let val = ev.target.value;

    if (typeof val == 'undefined' || val.trim() == '') {
      this.activities = this.allActivities;
    } else {
      this.activities = this.allActivities.filter((activity) => {
        if (activity.display_name) {
          return (activity.display_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        } else {
          return false;
        }
      })
    }
  }

  filterActivityName (activityDisplayName): string {
    return activityDisplayName.split(",", 2)[0];
  }

  onActivityClick(activity: any) {
    if (this.multiple) {
      activity.selezionata = true;
    } else {
      this.viewCtrl.dismiss(activity);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss(this.allActivities.filter(value => value.selezionata));
  }
}
