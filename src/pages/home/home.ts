import {
  Component,
  ChangeDetectionStrategy
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
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

  overlayHidden: boolean = true;

  private midataService: MidataService;

  constructor(public navCtrl: NavController, midataService: MidataService, private matomoTracker: MatomoTracker) {
    this.midataService = midataService;
  }

  public hideOverlay() {
    this.overlayHidden = true;
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
    this.matomoTracker.trackPageView("Startseite View besucht");
  }

  showOverlay() {
    if (this.overlayHidden == true) {
      this.overlayHidden = false;
    } else {
      this.overlayHidden = true;
    }
  }

  swipe(event) {
    if (event.direction === 2) { // 2 = nach rechts swipen
      this.navCtrl.parent.select(1); // 0 = Home, 1 = Mein Tag, 2 = Neuer Eintrag
      //track event
      this.matomoTracker.trackEvent("Page: Home", "Slide to Mein Tag View")
    }
  }

}
