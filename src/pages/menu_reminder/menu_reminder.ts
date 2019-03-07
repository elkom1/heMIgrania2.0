import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications';
import {
  AlertController
} from 'ionic-angular';


@Component({
  selector: 'page-menu_reminder',
  templateUrl: 'menu_reminder.html'
})
export class Reminder {

  reminder: boolean; 
  myTime: string; 

  constructor(public navCtrl: NavController,
    public localNotifications: LocalNotifications,
    private alertCtrl: AlertController) {
  }

  toggleLocalNotificatoin() {
    if (this.reminder && typeof this.myTime !== 'undefined') {
      let time = this.myTime.split(":");
      let date = new Date(new Date().getTime() + 3600);
      date.setHours(Number(time[0]));
      date.setMinutes(Number(time[1]));
      console.log(date.getTime());
      this.localNotifications.schedule({
        id: 1,
        text: 'Vergiss nicht deine tägliche Erfassung einzutragen',
        trigger: {
          firstAt: date,
          every: ELocalNotificationTriggerUnit.DAY, //MINUTE hat funktioniert 
          count: 500
        }
      });
    } else if (!this.reminder) {
      this.localNotifications.cancelAll();
    }

  } 
}