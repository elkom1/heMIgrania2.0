import {
  Component
} from '@angular/core';
import {
  NavController,
  LoadingController,
  Platform
} from 'ionic-angular';
import {
  InAppBrowser
} from '@ionic-native/in-app-browser';
import {
  MidataService
} from '../../services/midataService';
import {
  AlertController
} from 'ionic-angular';


@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})

export class LogoutPage {

  constructor(
    public navCtrl: NavController,
    private midataService: MidataService,
    private platform: Platform,
    private alertCtrl: AlertController) {}


  ngAfterViewInit() {
    this.platform.ready().then(() => {
      if (this.midataService.loggedIn()) {
        this.midataService.logout();
        this.navCtrl.popToRoot(); 

        let alert = this.alertCtrl.create();
        alert.setTitle("Abmeldung war erfolgreich");
        alert.addButton('Ok'); 
        alert.present(); 
      } else {
        this.navCtrl.popToRoot(); 

        let alert = this.alertCtrl.create();
        alert.setTitle("Du bist bereits abgemeldet");
        alert.addButton('Ok'); 
        alert.present(); 

        console.warn('bii baa buu wubba lubba dubb dubb');
      }
  });
  }

  logout() {
    this.platform.ready().then(() => {
        if (this.midataService.loggedIn()) {
          this.midataService.logout();
          this.navCtrl.popToRoot(); 

          let alert = this.alertCtrl.create();
          alert.setTitle("Abmeldung war erfolgreich");
          alert.addButton('Ok'); 
          alert.present(); 
        } else {
          this.navCtrl.popToRoot(); 

          let alert = this.alertCtrl.create();
          alert.setTitle("Du bist bereits abgemeldet");
          alert.addButton('Ok'); 
          alert.present(); 

          console.warn('bii baa buu wubba lubba dubb dubb');
        }
    });
  }

}
