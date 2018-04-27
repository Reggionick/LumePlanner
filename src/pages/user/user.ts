import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  prefParams = [
    {
      label: "resting",
      icon: "../../assets/imgs/resting-pin-b.svg",
      value: 0
    },
    {
      label: "attractions",
      icon: "../../assets/imgs/actraction-b.svg",
      value: 0
    },
    {
      label: "tree",
      icon: "../../assets/imgs/tree-pin-b.svg",
      value: 0
    },
    {
      label: "lifestyle",
      icon: "../../assets/imgs/lifestile-pin-b.svg",
      value: 0
    },
    {
      label: "eating",
      icon: "../../assets/imgs/eating-pin-b.svg",
      value: 0
    },
    {
      label: "parks",
      icon: "../../assets/imgs/park-pin.svg",
      value: 0
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public lumeHttp: LumeHttpProvider
  ) {
  }

  ionViewDidLoad() {
  }

  pressedPallino (prefIndex, index) {
    this.prefParams[prefIndex].value = index;
  }

  onSavePressed() {

    let valuesSum = 0;
    for (var pref of this.prefParams) {
      valuesSum += pref.value;
    }

    let scaledPrefValues = {};
    for (var pref of this.prefParams) {
      scaledPrefValues[pref.label] = pref.value / valuesSum * 100 | 0;
    }

    this.lumeHttp.postPreferences(scaledPrefValues).subscribe(value => {
      window.sessionStorage.setItem("preferences",JSON.stringify(value));

      let alert = this.alertCtrl.create({
        subTitle: 'Preferences saved correctly', //TODO: translate
        buttons: ['OK'] //TODO: translate
      });
      alert.present();
    })
  }

}
