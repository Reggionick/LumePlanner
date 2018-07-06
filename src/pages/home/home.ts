import {ChangeDetectorRef, Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import {ILatLng, Spherical} from "@ionic-native/google-maps";
import {BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse} from "@ionic-native/background-geolocation";

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

import { CityPage } from "../city/city";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  allCities: Array<any>;
  cities: any;

  constructor(
    public navCtrl: NavController,
    public backgroundGeolocation: BackgroundGeolocation,
    public changeDetectorRef: ChangeDetectorRef,
    public  lumeHttp: LumeHttpProvider
  ) {
    this.lumeHttp.getCities().subscribe((value: Array<any>) => {
      this.allCities = value;
      this.initializeItems();
    }, error => {
      console.error(JSON.stringify(error));
    })
  }

  initializeItems() {

    const bologna = {
      lat: 44.495154,
      lng: 11.343563
    };
    this.cities = this.allCitiesSortedFromPosition(bologna);

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 100,
      stationaryRadius: 200,
      distanceFilter: 300,
      stopOnTerminate: false
    };

    this.backgroundGeolocation.configure(config)
      .subscribe((location: BackgroundGeolocationResponse) => {
        let lastPosition;
        if (typeof location.coords !== "undefined") {
          lastPosition = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };
        } else {
          lastPosition = {
            lat: location.latitude,
            lng: location.longitude,
          };
        }

        this.cities = this.allCitiesSortedFromPosition(lastPosition);
        this.changeDetectorRef.detectChanges();

        this.backgroundGeolocation.finish();
        this.backgroundGeolocation.stop();
      });

    this.backgroundGeolocation.start();
  }

  allCitiesSortedFromPosition (position: ILatLng) {
    return this.allCities.sort((a, b) => {

      const lata = (a.lonLatBBox[1]+a.lonLatBBox[3]) / 2;
      const lnga = (a.lonLatBBox[0]+a.lonLatBBox[2]) / 2;

      const latb = (b.lonLatBBox[1]+b.lonLatBBox[3]) / 2;
      const lngb = (b.lonLatBBox[0]+b.lonLatBBox[2]) / 2;

      const da = Spherical.computeDistanceBetween(position, {lat: lata, lng: lnga});
      const db = Spherical.computeDistanceBetween(position, {lat: latb, lng: lngb});

      if (da < db) return -1;
      if (da > db) return 1;
      return 0;
    });
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
