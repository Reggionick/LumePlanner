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

  allActivities = [];
  activities = [];
  favourites = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public lumeHttp: LumeHttpProvider
  ) {
    this.city = this.navParams.data.city;
    this.filter = this.navParams.data.filter;

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

        this.favourites = JSON.parse(window.localStorage.getItem("favourites"));
        this.favourites = this.favourites[this.city.name] || {};

        for (const activity of value) {
          if (!activity.photo_url) {
            activity.photo_url = placeholders[activity.category];
          }
          activity.isFavourite = (typeof this.favourites[activity.place_id] != 'undefined');
        }

        if (this.filter === "cosedavedere") {
          this.allActivities = value;
        } else if (this.filter === "preferiti") {
          for (const activityIds of Object.keys(this.favourites)) {
            this.allActivities.push(this.favourites[activityIds]);
          }
        } else {
          this.allActivities = value.filter(
            activity => activity.category === this.filter);
        }

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

  onFavouriteClick(event, activity) {
    event.stopPropagation();

    if (activity.isFavourite) {
      activity.isFavourite = false;
      delete this.favourites[activity.place_id];
    } else {
      activity.isFavourite = true;
      this.favourites[activity.place_id] = activity;
    }
    let allFavourites = JSON.parse(window.localStorage.getItem("favourites"));
    allFavourites[this.city.name] = this.favourites;
    window.localStorage.setItem("favourites", JSON.stringify(allFavourites));
  }

  onActivityClick(activity: any) {
    this.navCtrl.push(ActivityPage, activity)
  }

}
