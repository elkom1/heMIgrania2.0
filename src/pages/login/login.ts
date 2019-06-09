import {
  Component,
  ViewChild,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/core';
import {
  IonicPage,
  NavController,
  LoadingController,
  Platform,
  Slides
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
  OpenNativeSettings
} from '@ionic-native/open-native-settings/ngx';

import {
  Storage
} from '@ionic/storage';
import {
  OnBoarding
} from '../onBoarding/onBoarding';
import {
  MenuPage
} from '../menu/menu';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  @ViewChild(Slides) slides: Slides;
  state: string = 'x';

  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private inAppBrowser: InAppBrowser,
    private midataService: MidataService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private matomoTracker: MatomoTracker,
    private openNativeSettings: OpenNativeSettings,
    private storage: Storage
  ) {}

  // register(){
  //   this.inAppBrowser.create('https://ch.midata.coop/#/portal/registration');
  // }

  // visitMidata() {
  //   this.inAppBrowser.create('https://midata.coop');
  // }

  ngAfterViewInit() {
    // this.platform.ready().then(() => {
    //   this.midataService.openSession().then(success => {
    //     if (success) {
    //       // this.navCtrl.pop();

    //       //Track event 
    //       this.matomoTracker.trackEvent("Login Succes", "MIDATA Login success")

    //       // let alert = this.alertCtrl.create();
    //       // alert.setTitle("Du bist bereits angemeldet");
    //       // alert.addButton('Ok');
    //       // alert.present();
    //     } else {
    //       console.warn('Anmeldung erforderlich');
    //     }
    //   });

    // Disable back button of the android HW device 
    document.addEventListener('backbutton', () => {
      if (this.navCtrl.canGoBack()) {
        this.platform.exitApp()
        return;
      }
      this.navCtrl.pop()
    }, false);

    // });
  }

  ngOnInit() {
    // this.storage.get('isFistTime').then((val) => {
    //   if (val || val == null) {
    //     console.log("Already opened");
    //     this.navCtrl.push(OnBoarding);
    //   } 
    // });

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
          // let alert = this.alertCtrl.create();
          // alert.setTitle("Anmeldung war erfolgreich");
          // alert.addButton('Ok');
          // alert.present();
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
        let alert2 = this.alertCtrl.create({
          message: "Damit Sie diese App nutzen können, müssen Sie ein Passwort auf Ihrem Gerät festlegen."
        })
        alert2.setTitle('Gerät ohne Sicherheitscode');
        alert2.addButton({
          text: 'Ok',
          handler: data => {
            //this.openNativeSettings.open("settings");
          }
        });
        alert2.present();
      })
  }



}
