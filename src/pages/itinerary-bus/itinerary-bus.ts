import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import * as moment from 'moment';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";


@Component({
  selector: 'page-itinerary-bus',
  templateUrl: 'itinerary-bus.html',
})
export class ItineraryBusPage {

  defaultHtml: SafeHtml;
  responseBox: SafeHtml;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    public lumeHttp: LumeHttpProvider
  ) {

    this.defaultHtml = this.sanitizer.bypassSecurityTrustScript('function convert2geojson(punti) {    var coords = [];    for(var i=0; i<punti.length;i++)        coords.push([punti[i].x,punti[i].y])    console.log(coords);    var geoj = {        type: "LineString",        coordinates: coords    };    return geoj}var iti_type; var tp_coords2Clicked = null;var tp_coords2Itinerary = null;var tp_markers = {};function mappaCreaPercorso(id, mezzo, punti) {    if(iti_type == ROUTE_TYPE.CLICKED) {        tp_coords2Clicked = convert2geojson(punti);        tp_markers[id] = L.geoJSON(tp_coords2Clicked, {style: pathStyle2Clicked}).bindPopup("percorso,"+id+","+mezzo)    }    if(iti_type == ROUTE_TYPE.ITINERARY) {        tp_coords2Itinerary = convert2geojson(punti);        tp_markers[id] = L.geoJSON(tp_coords2Itinerary, {style: pathStyle2Itinerary}).bindPopup("percorso,"+id+","+mezzo)    }}function mappaCreaStep(id, mezzo, punti) {}function mappaCreaFermata(id, lng, lat, tipo, testo) {    if(tipo=="Partenza" || tipo == "Arrivo") return;    console.log("mappaCreaFermata: "+id+", "+lng+", "+lat+", "+tipo+", "+testo);    tp_markers[id] = L.marker([lat,lng], {icon: tpIcons[tipo]}).bindPopup("<b>"+id+": "+tipo+"</b><br>"+testo);}function mappaVisualizzaOggetto(id) {    if(tp_markers[id]) tp_markers[id].addTo(mymap)}function mappaNascondiOggetto(id) {    if(tp_markers[id]) tp_markers[id].remove()}');

    const partenza = this.navParams.data.partenza;
    const arrivo = this.navParams.data.arrivo;

    const data = moment().format('DD/MM/YYYY');
    const ora = moment().format('HH:mm');

    const travelplannerReqestParams = {
      partenza: [{
        name: "Tua Posizione",
        externalId: "partenza_input",
        x: partenza.lon,
        y: partenza.lat,
        tipo: "coordinate"
      }],
      arrivo: [{
        name: arrivo.display_name,
        externalId: "arrivo_input",
        x: arrivo.geometry.coordinates[0],
        y: arrivo.geometry.coordinates[1],
        tipo: "coordinate"
      }],
      data: data,
      ora: ora,
      scelta_orario: "partenza",
      mezzi_usati:   ["AU", "AS", "AE", "R", "IC", "ES"],
      transito:      ""
    };
    this.lumeHttp.travleplanner(travelplannerReqestParams).subscribe(value => {
        const stringa = this.parseResponse(value)
        this.responseBox = this.sanitizer.bypassSecurityTrustHtml(stringa)
      },
      error => {
        debugger
      }
    )

  }

  ionViewDidLoad() {


  }

  parseResponse(html) {

    const lines = html.split("\n");
    for(let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("map.")) {
        lines[i] = "";
      }

      if(lines[i].indexOf("<img src=\"\" class") != -1) {
        const classS = lines[i].indexOf("<img src=\"\" class=\"")+"<img src=\"\" class=\"".length;
        const classE = lines[i].indexOf("\"",classS);
        const mezzo =  lines[i].substring(classS,classE);
        lines[i] = lines[i].replace("<img src=\"\"","<img src=\"assets/imgs/travelplanner/mezzi/"+mezzo+".png\"")
      }

      if(lines[i].indexOf("<img src=\"#\" class") != -1) {
        const classS = lines[i].indexOf("<img src=\"#\" class=\"")+"<img src=\"#\" class=\"".length;
        const classE = lines[i].indexOf("\"",classS);
        const mezzo =  lines[i].substring(classS,classE);

        lines[i] = lines[i].replace("<img src=\"#\"","<img src=\"assets/imgs/travelplanner/mezzi/"+mezzo+".png\"")
      }

      lines[i] = lines[i].replace(new RegExp("onmouseover", 'g'), "onclick")
    }

    return lines.join("\n");
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
