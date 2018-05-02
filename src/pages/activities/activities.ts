import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {LumeHttpProvider} from "../../providers/lume-http/lume-http";

import {ActivityPage} from "../activity/activity";

@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html',
})
export class ActivitiesPage {

  city: any;
  filter: string;

  activities = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public lumeHttp: LumeHttpProvider
  ) {
    this.city = this.navParams.data.city;
    this.filter = this.navParams.data.filter;

    this.lumeHttp.getActivities(this.city.name).subscribe(
      (value: any) => {
        if (this.filter === "cosedavedere") {
          this.activities = value;
        } else {
          this.activities = value.filter(
            activity => activity.category === this.filter);
        }
      }
    )

  }

  ionViewDidLoad() {

  }

  filterActivityName (activityDisplayName): string {
    return activityDisplayName.split(",", 2)[0];
  }

  onActivityClick(activity: any) {
    this.navCtrl.push(ActivityPage, activity)
  }
  
}
