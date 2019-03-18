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
    this.matomoTracker.setUserId('UserId');
    this.matomoTracker.setDocumentTitle('ngx-Matomo Test');
  }


}
