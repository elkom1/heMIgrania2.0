import {
  Impressum
} from './../menu_impressum/menu_impressum';
import {
  EntspannungsUebungen
} from './../menu_entspannungsUebungen/menu_entspannungsUebungen';
import {
  Diagnosen
} from './../menu_Diagnosen/menu_Diagnosen';
import {
  Datenschutz
} from './../menu_Datenschutz/menu_Datenschutz';
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
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Nutzungsbedingungen } from '../menu_Nutzungsbedingungen/menu_Nutzungsbedingungen';


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
      pageName: 'LoginPage',
      tabComponent: LoginPage,
      icon: 'contact'
    },
    {
      title: 'Startseite',
      pageName: 'MenuPage',
      tabComponent: MenuPage,
      icon: 'home'
    },
    // {
    //   title: 'Entspannungsübungen',
    //   pageName: 'EntspannungsUebungen',
    //   tabComponent: EntspannungsUebungen,
    //   icon: 'rose'
    // },
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
      title: 'Datenschutzerklärung',
      pageName: 'Datenschutz',
      tabComponent: Datenschutz,
      icon: 'lock'
    },
    {
      title: 'Nutzungsbedingungen',
      pageName: 'menu_Nutzungsbedingungen',
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

  constructor(public navCtrl: NavController, midataService: MidataService, private matomoTracker: MatomoTracker, private platform: Platform,
    private alertCtrl: AlertController, private inAppBrowser: InAppBrowser ) {
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
    this.matomoTracker.trackEvent("Page: Menu", "Menu list klick");
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

      if (page.tabComponent == LoginPage) {
        this.platform.ready().then(() => {
          if (this.midataService.loggedIn()) {
            this.inAppBrowser.create('https://ch.midata.coop/#/portal/login');
          } else {
            this.navCtrl.push(LoginPage)
          }
        });
      }

      else if (page.tabComponent == LogoutPage) {
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
      }
      else if(page.tabComponent != LogoutPage) {
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
