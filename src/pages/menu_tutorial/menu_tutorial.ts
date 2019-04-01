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
  selector: 'page-menu_tutorial',
  templateUrl: 'menu_tutorial.html'
})
export class Tutorial {

  selectedCard: Boolean = false;
  selectedCard2: Boolean = false;
  selectedCard3: Boolean = false;
  selectedCard4: Boolean = false;

  private midataService: MidataService;

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
    this.matomoTracker.trackPageView("Tutorial View besucht");
  }

  showText() {
    if (this.selectedCard == false) {
      this.selectedCard = true;
      //tracking event 
      this.matomoTracker.trackEvent("Page: Tutorial", "card 1 klick: Was sehe ich auf der Startseite?")
    } else {
      this.selectedCard = false;
    }
  }

  showText2() {
    if (this.selectedCard2 == false) {
      this.selectedCard2 = true;
      //tracking event 
      this.matomoTracker.trackEvent("Page: Tutorial", "card 2 klick: Was kann ich Bereich Mein Tag machen?")
    } else {
      this.selectedCard2 = false;
    }
  }

  showText3() {
    if (this.selectedCard3 == false) {
      this.selectedCard3 = true;
      //tracking event 
      this.matomoTracker.trackEvent("Page: Tutorial", "card 3 klick: Was kann ich im Bereich Neuer Eintrag machen?")
    } else {
      this.selectedCard3 = false;
    }
  }

  showText4() {
    if (this.selectedCard4 == false) {
      this.selectedCard4 = true;
      //tracking event 
      this.matomoTracker.trackEvent("Page: Tutorial", "card 4 klick: Was kann ich auf der Menüliste sehen?")
    } else {
      this.selectedCard4 = false;
    }
  }
}
