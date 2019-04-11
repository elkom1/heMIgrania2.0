import {
  Component
} from '@angular/core';
import {
  IonicPage,
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
import {
  MenuPage
} from '../menu/menu';


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
    private alertCtrl: AlertController,
    private matomoTracker: MatomoTracker) {}

  // register(){
  //   this.inAppBrowser.create('https://ch.midata.coop/#/portal/registration');
  // }

  visitMidata() {
    this.inAppBrowser.create('https://midata.coop');
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.midataService.openSession().then(success => {
        if (success) {
          this.navCtrl.pop();

          //Track event 
          this.matomoTracker.trackEvent("Login Succes", "MIDATA Login success")

          let alert = this.alertCtrl.create();
          alert.setTitle("Du bist bereits angemeldet");
          alert.addButton('Ok');
          alert.present();
        } else {
          console.warn('Anmeldung erforderlich');
        }
      });
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
    this.matomoTracker.trackPageView("Login View besucht");
  }

  goHome() {
    this.navCtrl.popToRoot();
    //tracking event 
    this.matomoTracker.trackEvent("Page: Login", "Zurück zur Startseite ohne Anmeldung")
  }

  login() {
    //tracking event 
    this.matomoTracker.trackEvent("Page: Login", "Anmelden Button klick")

    let loading = this.loadingCtrl.create({
      content: 'Bitte warten...'
    });

    loading.present().catch();

    this.midataService.authenticate()
      .then((success: boolean) => {
        if (success) {
          let alert = this.alertCtrl.create();
          alert.setTitle("Anmeldung war erfolgreich");
          alert.addButton('Ok');
          alert.present();
          //Track Event 
          this.matomoTracker.trackEvent("Login Succes", "MIDATA Login success")
          return this.navCtrl.pop();
        }
      })
      .then(() => {
        loading.dismiss().catch(); 
      })
      .catch((error) => {
          loading.dismiss().catch(); 
      })
  }
}
