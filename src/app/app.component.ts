import { Component, ViewChild } from '@angular/core';
import { Platform, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MenuPage } from '../pages/menu/menu';

import { MatomoInjector } from 'ngx-matomo';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;

 rootPage:any = MenuPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private matomoInjector: MatomoInjector) {
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

  // ngAfterViewInit(){
  //   this.nav.push(LoginPage)
  // }

}
