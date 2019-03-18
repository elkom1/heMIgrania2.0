import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import {
  MidataService
} from '../../services/midataService';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private midataService: MidataService;

  constructor(public navCtrl: NavController, midataService: MidataService) {
    this.midataService = midataService;
  }



}
