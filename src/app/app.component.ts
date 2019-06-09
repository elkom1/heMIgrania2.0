import {
  Component,
  ViewChild
} from '@angular/core';
import {
  Platform,
  Nav,
  NavController,
  LoadingController,
  AlertController
} from 'ionic-angular';
import {
  StatusBar
} from '@ionic-native/status-bar';
import {
  SplashScreen
} from '@ionic-native/splash-screen';

import {
  MenuPage
} from '../pages/menu/menu';

import {
  MatomoInjector,
  MatomoTracker
} from 'ngx-matomo';
import {
  LoginPage
} from '../pages/login/login';
import {
  OnBoarding
} from '../pages/onBoarding/onBoarding';
import {
  MidataService
} from '../services/midataService';
import {
  OpenNativeSettings
} from '@ionic-native/open-native-settings/ngx';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;

  rootPage: any = MenuPage;

  constructor(
    statusBar: StatusBar,
    splashScreen: SplashScreen, private matomoInjector: MatomoInjector,
    private loadingCtrl: LoadingController,
    private midataService: MidataService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private matomoTracker: MatomoTracker) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      //piwik initialise
      this.matomoInjector.init('https://analytics.i4mi.bfh.ch/', 2);

      splashScreen.hide();
      statusBar.hide();

    });
  }

  //Login Handling: if not logged in then push Login Page, else stay on Home 
  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.midataService.openSession().then(success => {
        if (success) {
          //Track event 
          this.matomoTracker.trackEvent("Login Succes", "MIDATA Login success")
          this.nav.popToRoot();          
        } else {
          this.nav.push(LoginPage)
          console.warn('Anmeldung erforderlich');
        }
      }).catch(() => {
        this.nav.push(LoginPage)
      })
    });

  }

}
