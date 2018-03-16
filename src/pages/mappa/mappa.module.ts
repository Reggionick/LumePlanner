import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MappaPage } from './mappa';
import { GoogleMaps } from '@ionic-native/google-maps';

@NgModule({
  declarations: [
    MappaPage,
  ],
  imports: [
    IonicPageModule.forChild(MappaPage),
  ],
  providers: [
    GoogleMaps
  ]
})
export class MappaPageModule {}
