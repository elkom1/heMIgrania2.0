import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import {
  Tutorial
} from './../menu_tutorial/menu_tutorial';

import {
  MidataService
} from '../../services/midataService';
import { LoginPage } from '../login/login';


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
