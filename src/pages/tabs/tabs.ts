import {
  Component
} from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

import {
  MyDayPage
} from '../myDayPage/myDayPage';
import {
  NewAttackPage
} from '../newAttackPage/newAttackPage';
import {
  HomePage
} from '../home/home';

import {
  NativePageTransitions,
  NativeTransitionOptions
} from '@ionic-native/native-page-transitions';
import {
  EntspannungsUebungen
} from '../menu_entspannungsUebungen/menu_entspannungsUebungen';


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MyDayPage;
  tab3Root = NewAttackPage;

  loaded: boolean = false;
  tabIndex: number = 0;

  constructor(public nativePageTransitions: NativePageTransitions,
    public navParams: NavParams,
    public navCtrl: NavController) {
    this.tabIndex = navParams.data.tabIndex || 0;
  }
  // Create the function for getting animation direction by tab index
  public getAnimationDirection(index): string {
    var currentIndex = this.tabIndex;

    this.tabIndex = index;

    switch (true) {
      case (currentIndex < index):
        return ('left');
      case (currentIndex > index):
        return ('right');
    }
  }
  // Create the function for the animated transition
  public transition(e): void {
    let options: NativeTransitionOptions = {
      direction: this.getAnimationDirection(e.index),
      duration: 250,
      slowdownfactor: -1,
      slidePixels: 0,
      iosdelay: 20,
      androiddelay: 0,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 48
    };

    if (!this.loaded) {
      this.loaded = true;
      return;
    }

    this.nativePageTransitions.slide(options);
  }

}
