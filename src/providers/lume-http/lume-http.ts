import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LumeHttpProvider {

  ditaServer = 'http://lume.morselli.unimore.it/DITA/WS/';

  user: string;

  constructor(public http: HttpClient) {
    this.user = window.localStorage.getItem("user");
  }

  getCities() {
    return this.http.get(this.ditaServer + "cities");
  }

  getActivities(city: string) {
    return this.http.get(this.ditaServer + "activities?city=" + city + "&user=" + this.user);
  }
}
