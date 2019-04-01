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
import {
  MatomoTracker
} from 'ngx-matomo';


@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})

export class LogoutPage {

  constructor(
    public navCtrl: NavController,
    private midataService: MidataService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private matomoTracker: MatomoTracker) {}


  ngAfterViewInit() {
    this.platform.ready().then(() => {
      if (this.midataService.loggedIn()) {
        this.midataService.logout();
        this.navCtrl.popToRoot();

        //Tracking event 
        this.matomoTracker.trackEvent("Logout success", "MIDATA Logout success")

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

  ngOnInit() {
    //set user ID and document title 
    if (this.midataService.loggedIn()) {
      this.matomoTracker.setUserId(this.midataService.getUser().email);
      this.matomoTracker.setDocumentTitle('Bachelorthesis START Tracking');

      console.log(this.matomoTracker.setUserId(this.midataService.getUser().email))
      console.log(this.matomoTracker.setDocumentTitle('Bachelorthesis START Tracking'))
    } else {
      this.matomoTracker.setDocumentTitle('Bachelorthesis START Tracking');
    }
    //Tracking Page view 
    this.matomoTracker.trackPageView("Logout View besucht");
  }

  logout() {
    this.platform.ready().then(() => {
      if (this.midataService.loggedIn()) {
        this.midataService.logout();
        this.navCtrl.popToRoot();

        //Tracking event 
        this.matomoTracker.trackEvent("Logout success", "MIDATA Logout success")

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
