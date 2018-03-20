import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  allCities: any;
  cities: any;

  constructor(
    public navCtrl: NavController,
    public  lumeHttp: LumeHttpProvider
  ) {
    this.lumeHttp.getCities().subscribe(value => {
      this.allCities = value;
    this.initializeItems();
    }, error => {
      console.error(error);
    })
  }

  initializeItems() {
    this.cities = this.allCities.slice(0,3);
  }

  getFilteredCities (ev: any) {

    let val = ev.target.value;

    if (typeof val == 'undefined' || val.trim() == '') {
      this.cities = this.allCities.slice(0,3);
    } else {
      this.cities = this.allCities.filter((city) => {
        if (city.pretty_name) {
          return (city.pretty_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        } else {
          return false;
        }
      })
    }
  }
}
