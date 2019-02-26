import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {NativeStorage} from '@ionic-native/native-storage';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Network } from '@ionic-native/network';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


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
import { MenuPage } from '../pages/menu/menu';


import { LoginPage } from "../pages/login/login";
import { LogoutPage } from "../pages/logout/logout";
import { MidataService} from "../services/midataService";

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
    Reminder, 
    Tutorial, 
    LoginPage,
    LogoutPage,
 
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
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
    Reminder, 
    Tutorial, 
    LoginPage, 
    LogoutPage,
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

    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
