import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-menu_reminder',
  templateUrl: 'menu_reminder.html'
})
export class Reminder {

  reminder: any; 
  myTime: any; 

  constructor(public navCtrl: NavController) {
  }
  
}
