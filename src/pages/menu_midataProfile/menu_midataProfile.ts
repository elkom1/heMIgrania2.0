import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import {
  MidataService
} from '../../services/midataService';
import {
  MatomoTracker
} from 'ngx-matomo';

@Component({
  selector: 'page-menu_midataProfile',
  templateUrl: 'menu_midataProfile.html'
})
export class MidataProfile {

  private midataService: MidataService;

  email: string; 

  constructor(public navCtrl: NavController, midataService: MidataService, private matomoTracker: MatomoTracker) {
    this.midataService = midataService;
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
    this.matomoTracker.trackPageView("MIDATA Benutzerkonto View besucht");

    this.email = this.midataService.getUser().email; 
  }

}
