import { Component, ViewChild, trigger, transition, style, state, animate, keyframes, ChangeDetectionStrategy, SkipSelf } from '@angular/core';
import {
  NavController, Slides
} from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-onBoarding',
  templateUrl: 'onBoarding.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [

    trigger('bounce', [
      state('*', style({
        transform: 'translateX(0)'
      })),
      transition('* => rightSwipe', animate('700ms ease-out', keyframes([
        style({transform: 'translateX(0)', offset: 0}),
        style({transform: 'translateX(-65px)', offset: .3}),
        style({transform: 'translateX(0)', offset: 1})
      ]))),
      transition('* => leftSwipe', animate('700ms ease-out', keyframes([
        style({transform: 'translateX(0)', offset: 0}),
        style({transform: 'translateX(65px)', offset: .3}),
        style({transform: 'translateX(0)', offset: 1})
      ])))
    ])
  ]
})
export class OnBoarding {
  

  @ViewChild(Slides) slides: Slides;
  skipMsg: string = "Überspringen";
  state: string = 'x';

  constructor(public navCtrl: NavController, private storage: Storage) {
  }

  skip() {
    this.storage.set('isFirstTime', 'true');
    this.navCtrl.pop();
  }

  slideChanged() {
    if (this.slides.isEnd())
      this.skipMsg = "Verstanden und weiter";
  }

  slideMoved() {
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex())
      this.state = 'rightSwipe';
    else
      this.state = 'leftSwipe';
  }

  animationDone() {
    this.state = 'x';
  }


}
