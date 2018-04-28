import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

import { CityPage } from "../city/city";

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
    this.cities = this.allCities;
  }

  getFilteredCities (ev: any) {

    let val = ev.target.value;

    if (typeof val == 'undefined' || val.trim() == '') {
      this.cities = this.allCities;
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

  onCityClick(selectedCity: any) {
    window.localStorage.setItem("city", JSON.stringify(selectedCity));
    this.navCtrl.push(CityPage, selectedCity);
  }
}
