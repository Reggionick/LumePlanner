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

  getItineraries(city: any, position: {lat: number, lng: number}) {
    let reqParams = "city=" + city + "&user=" + this.user
    if (position) {
      reqParams += "&lat=" + position.lat + "&lng=" + position.lng;
    }

    return this.http.get(this.ditaServer + "itineraries?" + reqParams);
  }

  getCheckuser() {
    return this.http.get(this.ditaServer + "checkuser?userid=" + this.user);
  }

  postPreferences(preferences: any) {
    const jsonObj = {
      user: this.user,
      prefs: preferences
    };
    return this.http.post(this.ditaServer + "updatepref", jsonObj);
  }

  postPlan(plan: any) {
    plan.user = this.user;
    return this.http.post(this.ditaServer + "newplan", plan);
  }

  postAcceptPlan(plan: any) {
    plan.user = this.user;
    return this.http.post(this.ditaServer + "accept_plan", plan);
  }
}
