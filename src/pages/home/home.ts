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

    console.log("Musab   " + this.matomoTracker.setTrackerUrl)

    console.log(this.matomoTracker.setUserId('UserID'))
    console.log(this.matomoTracker.setDocumentTitle('ngx-Matomo Test'))
    console.log(this.matomoTracker.trackPageView)

    this.matomoTracker.trackPageView; 
  }

}
