import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EmailComposer } from "@ionic-native/email-composer";

@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  helpText: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public emailComposer: EmailComposer
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');

    this.emailComposer.isAvailable().then((available: boolean) =>{
      if (available) {

      }
    });

  }

  onInviaPressed() {
    const user = window.localStorage.getItem("user");

    let email = {
      to: 'marco.mamei@gmail.com',
      subject: 'Lume help request',
      body: this.helpText + "<br/><br/> from: "+ user,
      isHtml: true
    };

    this.emailComposer.open(email);
  }

}
