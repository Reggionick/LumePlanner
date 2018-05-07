import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LumeHttpProvider {

  ditaServer = 'http://lume.morselli.unimore.it/DITA/WS/';
  ditaServerFiles = 'http://lume.morselli.unimore.it/DITA/WS/files/';

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

  getLocalize(coord: {lat: number, lon: number}) {
    return this.http.get(this.ditaServer + "localize?user=" + this.user + "&lat=" + coord.lat + "&lon=" + coord.lon);
  }

  getRoute(fromCoord: {lat: number, lon: number}, toCoord: {lat: number, lon: number}) {
    const start = fromCoord.lat + "," + fromCoord.lon;
    const end = toCoord.lat + "," + toCoord.lon;
    return this.http.get(this.ditaServer + "http://lume.morselli.unimore.it/DITA/WS/route?vehicle=foot&start=" + start + "&end=" + end);
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

  postVisit(city: string, activity: any) {
    const jsonObj = {
      user: this.user,
      visited: activity,
      city: city,
      time: new Date().getTime(),
      rating: 10
    };
    return this.http.post(this.ditaServer + "visited", jsonObj);
  }

  postFinish() {
    return this.http.post(this.ditaServer + "finish", this.user);
  }


  getCrowd(city: string) {
    return this.http.get(this.ditaServerFiles + "data/" + city + "/crowd.json");
  }
}
