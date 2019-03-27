import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import {
  MidataService
} from '../../services/midataService';

import { MatomoTracker } from 'ngx-matomo';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private midataService: MidataService;

  constructor(public navCtrl: NavController, midataService: MidataService, private matomoTracker: MatomoTracker) {
    this.midataService = midataService;
  }

   ngOnInit() {
    // this.matomoTracker.setUserId('UserID');
    // this.matomoTracker.setDocumentTitle('ngx-Matomo Test');

    if(this.midataService.loggedIn()) {
    this.matomoTracker.setUserId(this.midataService.getUser().email);
    this.matomoTracker.setDocumentTitle('ngx-Matomo Test22');

    console.log(this.matomoTracker.setUserId(this.midataService.getUser().email))
    console.log(this.matomoTracker.setDocumentTitle('ngx-Matomo Test22'))
    }
    this.matomoTracker.trackPageView; 
  }

}
