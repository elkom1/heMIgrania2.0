import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {NativeStorage} from '@ionic-native/native-storage';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Network } from '@ionic-native/network';
import { SecureStorage} from '@ionic-native/secure-storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';


import { OnBoarding } from '../pages/onBoarding/onBoarding';
import { MyDayPage } from '../pages/myDayPage/myDayPage';
import { NewAttackPage } from '../pages/newAttackPage/newAttackPage';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { Impressum } from '../pages/menu_impressum/menu_impressum';
import { Tutorial } from '../pages/menu_tutorial/menu_tutorial';
import { Reminder } from '../pages/menu_reminder/menu_reminder';
import { EntspannungsUebungen } from '../pages/menu_entspannungsUebungen/menu_entspannungsUebungen';
import { Diagnosen } from '../pages/menu_Diagnosen/menu_Diagnosen';
import { Datenschutz } from '../pages/menu_Datenschutz/menu_Datenschutz';
import {Nutzungsbedingungen} from '../pages/menu_Nutzungsbedingungen/menu_Nutzungsbedingungen';
import { MenuPage } from '../pages/menu/menu';
import { MidataProfile } from '../pages/menu_midataProfile/menu_midataProfile';

import { IonicStorageModule } from '@ionic/storage';


import { LoginPage } from "../pages/login/login";
import { LogoutPage } from "../pages/logout/logout";
import { MidataService} from "../services/midataService";
import { MenuService } from '../services/menuService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatomoModule } from 'ngx-matomo';


@NgModule({
  declarations: [
    MyApp,
    MyDayPage,
    NewAttackPage,
    Impressum,
    HomePage,
    TabsPage,
    MenuPage,
    EntspannungsUebungen, 
    Diagnosen, 
    Datenschutz,
    Nutzungsbedingungen,
    Reminder, 
    Tutorial, 
    LoginPage,
    LogoutPage,
    MidataProfile,
    OnBoarding,
 
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp), 
    MatomoModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyDayPage,
    NewAttackPage,
    HomePage,
    TabsPage,
    Impressum,
    MenuPage, 
    EntspannungsUebungen,
    Diagnosen, 
    Datenschutz,
    Nutzungsbedingungen,
    Reminder, 
    Tutorial, 
    LoginPage, 
    LogoutPage,
    MidataProfile, 
    OnBoarding, 
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativePageTransitions,
    InAppBrowser,
    NativeStorage,
    SecureStorage,
    Network,
    MidataService,
    BarcodeScanner,
    LocalNotifications,
    MenuService,
    OpenNativeSettings,
    BrowserAnimationsModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
