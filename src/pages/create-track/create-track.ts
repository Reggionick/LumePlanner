import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

@Component({
  selector: 'page-create-track',
  templateUrl: 'create-track.html',
})
export class CreateTrackPage {

  luoghi: Array<string> = [];

  dataInizio: string;
  oraInizio: string;
  luogoPartenza: string;
  luogoArrivo: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public lumeHttp: LumeHttpProvider
  ) {
    this.dataInizio = new Date().toISOString();
    this.oraInizio = new Date().toISOString();

    this.lumeHttp.getActivities("Modena").subscribe((value: Array<any>) => {
      let activitiesCategorized = {};

      for (let i = 0; i < value.length; i++) {
        if (!activitiesCategorized.hasOwnProperty(value[i].category)) {
          activitiesCategorized[value[i].category] = [];
        }
        activitiesCategorized[value[i].category].push(value[i]);
      }

      if (activitiesCategorized['resting']) {
        for (let i = 0; i < activitiesCategorized["resting"].length; i++) {
          const name = activitiesCategorized["resting"][i].display_name.split(',')[0];
          this.luoghi.push(name);
        }
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateTrackPage');
  }

}
