import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MidataService } from '../../services/midataService';
import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';
import {
  AlertController
} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  constructor(
      public navCtrl: NavController,
      private loadingCtrl: LoadingController,
      private inAppBrowser: InAppBrowser,
      private midataService: MidataService,
      private platform: Platform,
      private alertCtrl: AlertController) {
  }

  // register(){
  //   this.inAppBrowser.create('https://test.midata.coop/#/portal/registration');
  // }

  visitMidata(){
    this.inAppBrowser.create('https://midata.coop');
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.midataService.openSession().then(success => {
      if (success) {
        this.navCtrl.popToRoot(); 

        let alert = this.alertCtrl.create();
          alert.setTitle("Du bist bereits angemeldet");
          alert.addButton('Ok'); 
          alert.present(); 
      }
      else {
        console.warn('bii baa buu wubba lubba dubb dubb');
      }
    });
    });
  }

  goHome() {
    this.navCtrl.popToRoot(); 
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Bitte warten...' 
    });

    loading.present().catch();

    this.midataService.authenticate()
      .then((success: boolean) => {  
        let alert = this.alertCtrl.create();
          alert.setTitle("Anmeldung war erfolgreich");
          alert.addButton('Ok'); 
          alert.present(); 
      return this.navCtrl.popToRoot(); 
    })
      .then(() => {
      loading.dismiss().catch();
    })
      .catch((error) => {
      loading.dismiss().catch();
    })
  }
}
