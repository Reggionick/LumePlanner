import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage {

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

  }

}
