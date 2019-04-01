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
   selector: 'page-entspannungsUebungen',
   templateUrl: 'menu_entspannungsUebungen.html'
 })
 export class EntspannungsUebungen {

   selectedCard: Boolean = false;
   selectedCard2: Boolean = false;
   selectedCard3: Boolean = false;

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
     this.matomoTracker.trackPageView("Entspannungsübungen View besucht");
   }

   showText() {
     if (this.selectedCard == false) {
       this.selectedCard = true;
       //tracking event 
       this.matomoTracker.trackEvent("Page: Entspannungsübungen", "Muskelrelaxation Übung klick")
     } else {
       this.selectedCard = false;
     }
   }

   showText2() {
     if (this.selectedCard2 == false) {
       this.selectedCard2 = true;
     } else {
       this.selectedCard2 = false;
     }
   }

   showText3() {
     if (this.selectedCard3 == false) {
       this.selectedCard3 = true;
     } else {
       this.selectedCard3 = false;
     }
   }

 }
