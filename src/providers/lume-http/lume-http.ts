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
    const reqParams = "city=" + city + "&user=" + this.user + "&lat=" + position.lat + "&lng=" + position.lng;
    return this.http.get(this.ditaServer + "itineraries?" + reqParams);
  }

  postPreferences(preferences: any) {
    const jsonObj = {
      user: this.user,
      prefs: preferences
    };
    return this.http.post(this.ditaServer + "updatepref", jsonObj);
  }
}
