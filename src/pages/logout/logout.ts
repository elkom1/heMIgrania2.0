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
  MenuPage
} from '../../pages/menu/menu';
import {
  MidataService
} from '../../services/midataService';
import {
  NativeStorage
} from '@ionic-native/native-storage';
import {
  LoginPage
} from '../login/login';


@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})

export class LogoutPage {

  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private inAppBrowser: InAppBrowser,
    private midataService: MidataService,
    private platform: Platform) {}


  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.midataService.logout().then(success => {
        if (success) {
          this.navCtrl.setRoot(LoginPage)
        } else {
          console.warn('bii baa buu wubba lubba dubb dubb');
        }
      });
    });
  }

  logout() {
    this.platform.ready().then(() => {
      this.midataService.logout().then(success => {
        if (success) {
          this.navCtrl.setRoot(LoginPage)
        } else {
          console.warn('bii baa buu wubba lubba dubb dubb');
        }
      });
    });
  }

}
