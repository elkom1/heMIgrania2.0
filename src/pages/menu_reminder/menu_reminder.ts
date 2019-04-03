import {
  Component
} from '@angular/core';
import {
  NavController,
  AlertController
} from 'ionic-angular';
import {
  LocalNotifications,
  ELocalNotificationTriggerUnit
} from '@ionic-native/local-notifications';
import {
  MatomoTracker
} from 'ngx-matomo';
import {
  MidataService
} from '../../services/midataService';

@Component({
  selector: 'page-menu_reminder',
  templateUrl: 'menu_reminder.html'
})
export class Reminder {

  reminder: boolean;
  myTime: string;

  private midataService: MidataService;

  constructor(public navCtrl: NavController,
    public localNotifications: LocalNotifications,
    midataService: MidataService,
    private matomoTracker: MatomoTracker,
    private alertCtrl: AlertController) {

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
    this.matomoTracker.trackPageView("Reminder View besucht");

    //Starting Default value 
    let time2 = new Date();
    time2.setHours(20);
    time2.setMinutes(0);
    this.myTime = time2.toISOString();
  }

  toggleLocalNotificatoin() {
    if (this.reminder && typeof this.myTime !== 'undefined') {
      //show popup
      let alert2 = this.alertCtrl.create();
      alert2.setTitle('Deine Erinnerung wurde gesetzt um:' + ' ' + this.myTime.substring(11, 16) + ' Uhr');
      alert2.addButton('Ok');
      alert2.present();

      //tracking event
      this.matomoTracker.trackEvent("Page: Reminder", "Reminder set")
      let time = this.myTime.split(":");
      let date = new Date(new Date().getTime() + 3600);
      date.setHours(Number(time[0]));
      date.setMinutes(Number(time[1]));
      console.log(date.getTime());
      this.localNotifications.schedule({
        id: 1,
        icon: 'file://assets/imgs/icon.png',
        text: 'Vergiss nicht deine tägliche Erfassung einzutragen',
        trigger: {
          firstAt: date,
          every: ELocalNotificationTriggerUnit.DAY,
          count: 500
        }
      });
    } 
    
    else if (!this.reminder) {
      this.localNotifications.cancelAll();
      //tracking event
      this.matomoTracker.trackEvent("Page: Reminder", "Reminder cancelled")
    }

  }
}
