import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LumeHttpProvider {

  ditaServer = 'http://lume.morselli.unimore.it/DITA/WS/';

  constructor(public http: HttpClient) {}

  getCities() {
    return this.http.get(this.ditaServer + "cities");
  }
}
