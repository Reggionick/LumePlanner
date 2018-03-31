import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  restingSliderValue: number = 0;
  attractionsSliderValue: number = 0;
  treeSliderValue: number = 0;
  lifestyleSliderValue: number = 0;
  eatingSliderValue: number = 0;
  parksSliderValue: number = 0;

  prefParams = {
    resting: 0,
    attractions: 0,
    tree: 0,
    lifestyle: 0,
    eating: 0,
    parks: 0
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public lumeHttp: LumeHttpProvider
    ) {
  }

  ionViewDidLoad() {
  }

  onSavePressed() {

    const valuesSum = this.restingSliderValue + this.attractionsSliderValue + this.treeSliderValue + this.lifestyleSliderValue + this.eatingSliderValue + this.parksSliderValue;

    this.prefParams.resting = this.restingSliderValue / valuesSum * 100 | 0;
    this.prefParams.attractions = this.attractionsSliderValue / valuesSum * 100 | 0;
    this.prefParams.tree = this.treeSliderValue / valuesSum * 100 | 0;
    this.prefParams.lifestyle = this.lifestyleSliderValue / valuesSum * 100 | 0;
    this.prefParams.eating = this.eatingSliderValue / valuesSum * 100 | 0;
    this.prefParams.parks = this.parksSliderValue / valuesSum * 100 | 0;

    this.lumeHttp.postPreferences(this.prefParams).subscribe(value => {
      window.sessionStorage.setItem("preferences",JSON.stringify(value));

      let alert = this.alertCtrl.create({
        subTitle: 'Preferences saved correctly', //TODO: translate
        buttons: ['OK'] //TODO: translate
      });
      alert.present();
    })
  }

}
