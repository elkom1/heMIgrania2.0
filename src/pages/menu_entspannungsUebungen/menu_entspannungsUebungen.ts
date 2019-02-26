import {
  Component
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';

@Component({
  selector: 'page-entspannungsUebungen',
  templateUrl: 'menu_entspannungsUebungen.html'
})
export class EntspannungsUebungen {

  selectedCard: Boolean = false;
  selectedCard2: Boolean = false;
  selectedCard3: Boolean = false;

  constructor(public navCtrl: NavController) {}

  showText() {
    if (this.selectedCard == false) {
      this.selectedCard = true;
    } else {
      this.selectedCard = false;
    }
  }

  showText2() {
    if (this.selectedCard2 == false) {
      this.selectedCard2 = true;
    } else {
      this.selectedCard2 = false;
    }
  }

  showText3() {
    if (this.selectedCard3 == false) {
      this.selectedCard3 = true;
    } else {
      this.selectedCard3 = false;
    }
  }

}
