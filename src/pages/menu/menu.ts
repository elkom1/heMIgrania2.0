import {
  Impressum
} from './../menu_impressum/menu_impressum';
import {
  Diagnosen
} from './../menu_Diagnosen/menu_Diagnosen';
import {
  Reminder
} from './../menu_reminder/menu_reminder'
import {
  TabsPage
} from './../tabs/tabs';
import {
  Tutorial
} from './../menu_tutorial/menu_tutorial';
import {
  Component,
  ViewChild
} from '@angular/core';
import {
  NavController,
  Nav,
  AlertController,
  Platform
} from 'ionic-angular';
import {
  LogoutPage
} from '../logout/logout';
import {
  LoginPage
} from '../login/login';
import {
  MidataService
} from '../../services/midataService';
import {
  MatomoTracker
} from 'ngx-matomo';
import {
  Nutzungsbedingungen
} from '../menu_Nutzungsbedingungen/menu_Nutzungsbedingungen';
import {
  InAppBrowser
} from '@ionic-native/in-app-browser';
import {
  MidataProfile
} from '../menu_midataProfile/menu_midataProfile';
import {
  LocalNotifications
} from '@ionic-native/local-notifications';


export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent ? : any;
  index ? : number;
  icon: string;
}

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  // Basic root for our content view
  rootPage = TabsPage;

  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  pages: PageInterface[] = [{
      title: 'MIDATA Benutzerkonto',
      pageName: 'MidataProfile',
      tabComponent: MidataProfile,
      icon: 'contact'
    },
    {
      title: 'Startseite',
      pageName: 'MenuPage',
      tabComponent: MenuPage,
      icon: 'home'
    },
    {
      title: 'Wie nutze ich heMIgrania',
      pageName: 'Tutorial',
      tabComponent: Tutorial,
      icon: 'help'
    },
    {
      title: 'Meine Diagnosen',
      pageName: 'Diagnosen',
      tabComponent: Diagnosen,
      icon: 'medkit'
    },
    {
      title: 'Erinnerung',
      pageName: 'Reminder',
      tabComponent: Reminder,
      icon: 'alarm'
    },
    {
      title: 'anakoda Dashboard',
      pageName: 'Dashboard',
      tabComponent: '',
      icon: 'stats'
    },
    {
      title: 'Nutzungsbedingungen',
      pageName: 'Nutzungsbedingungen',
      tabComponent: Nutzungsbedingungen,
      icon: 'book'
    },
    {
      title: 'Impressum',
      pageName: 'Impressum',
      tabComponent: Impressum,
      icon: 'contacts'
    },
    {
      title: 'Abmelden',
      pageName: 'LogoutPage',
      tabComponent: LogoutPage,
      icon: 'log-out'
    },
  ];

  private midataService: MidataService;

  userStatus: string;

  constructor(public navCtrl: NavController, midataService: MidataService, private matomoTracker: MatomoTracker, private platform: Platform,
    private alertCtrl: AlertController, private inAppBrowser: InAppBrowser,
    public localNotifications: LocalNotifications
  ) {
    this.midataService = midataService;
  }

  ngOnInit() {

    //set user ID and document title
    if (this.midataService.loggedIn()) {
      this.matomoTracker.setUserId(this.midataService.getUser().email);
      this.matomoTracker.setDocumentTitle('Bachelorthesis START Tracking');

      this.userStatus = this.midataService.getUser().email;

      console.log(this.matomoTracker.setUserId(this.midataService.getUser().email))
      console.log(this.matomoTracker.setDocumentTitle('Bachelorthesis START Tracking'))
    } else {
      this.matomoTracker.setDocumentTitle('Bachelorthesis START Tracking');
    }
    //Tracking Page view
    this.matomoTracker.trackEvent("Page: Menu", "Menu list klick");
  }


  ngAfterViewInit() {

    // this.platform.ready().then(() => {
    //   this.midataService.openSession().then(success => {
    //     if (success) {
    //       this.userStatus = this.midataService.getUser().email;
    //     } else {
    //       console.warn('Anmeldung erforderlich');
    //       this.userStatus = "Offline"
    //     }
    //   }).catch(() => {
    //     console.log("catch activity status error")
    //     this.userStatus = this.midataService.getUser().email;

    //   })
    // });

    this.setReminder();
  }

  //Set Push Reminder after two Days not entering the App 
  setReminder() {
    let date = new Date(new Date().getTime() + 3600);
    date.setDate(date.getDay() + 2);
    this.localNotifications.schedule({
      id: 2,
      icon: 'file://assets/imgs/icon.png',
      text: 'Du hast heMIgrania bereits seit 2 Tagen nicht mehr benutzt. Achte Darauf, dass du regelmässig Einträge machst.',
      trigger: {
        firstAt: date,
        count: 500
      }
    });
  }

  openPage(page: PageInterface) {
    let params = {};
    // The index is equal to the order of our tabs inside tabs.ts
    if (page.index) {
      params = {
        tabIndex: page.index
      };
    }
    // The active child nav is our Tabs Navigation
    if (this.nav.getActiveChildNavs()[0] && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {

      if (page.pageName == 'Dashboard') {
        this.inAppBrowser.create('https://anakoda.ch/app');
      }

      if (page.tabComponent == LogoutPage) {
        this.platform.ready().then(() => {
          if (this.midataService.loggedIn()) {

            let alert = this.alertCtrl.create({
              message: "Bist du sicher, dass du dich abmelden willst?"
            });
            alert.setTitle("Bestätigung");
            alert.addButton('Abbrechen');
            alert.addButton({
              text: 'Ja',
              handler: data => {
                this.midataService.logout();
                this.navCtrl.push(LoginPage);
                //Tracking event
                this.matomoTracker.trackEvent("Logout success", "MIDATA Logout success")
              }
            });
            alert.present();
          } else {
            this.navCtrl.popToRoot();

            let alert = this.alertCtrl.create();
            alert.setTitle("Du bist bereits abgemeldet");
            alert.addButton('Ok');
            alert.present();

            console.warn('bii baa buu wubba lubba dubb dubb');
          }
        });
      } else if (page.tabComponent != LogoutPage) {
        // Tabs are not active, so reset the root page
        // In this case: moving to or from SpecialPage
        this.nav.push(page.tabComponent, params);
        this.isActive(this.nav.getActiveChildNav())
      }
    }
  }

  isActive(page: PageInterface) {
    // Again the Tabs Navigation
    let childNav = this.nav.getActiveChildNavs()[0];

    if (childNav = undefined) {
      if (childNav.getSelected() === page.tabComponent) {
        return 'primary';
      }
      return;
    }
    // Fallback needed when there is no active childnav (tabs not active)
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary';
    }
    return;
  }

}
