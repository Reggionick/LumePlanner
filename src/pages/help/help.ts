import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import { LumeHttpProvider } from "../../providers/lume-http/lume-http";

@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  helpText: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public lumeHttp: LumeHttpProvider

  ) {
  }

  ionViewDidLoad() {

  }

  onInviaPressed() {
    this.lumeHttp.postHelp("", this.helpText).subscribe(
      value => {
        if (value) {
          this.helpText = "";
          let alert = this.alertCtrl.create({
            subTitle: 'Richiesta inviata correttamente', //TODO: translate
            buttons: ['OK'] //TODO: translate
          });
          alert.present();
        }
      }
    );
  }

}
