import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import {
  AlertController
} from 'ionic-angular';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {
  NewAttackPage
} from '../newAttackPage/newAttackPage';
import {
  HomePage
} from '../home/home';
import {
  TabsPage
} from '../tabs/tabs';
import {
  Observation,
  Bundle
} from 'Midata';
import {
  MidataService
} from '../../services/midataService';
import {
  LoginPage
} from '../login/login';
import {
  MenuPage
} from '../menu/menu';
import {
  MatomoTracker
} from 'ngx-matomo';


@Component({
  selector: 'page-myDay',
  templateUrl: 'myDayPage.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyDayPage {
  testCheckboxOpen = false;

  group: FormGroup;

  sleepTime: string;
  awakeTime: string;
  sleepQuality: number = 0;
  eatingHabit: string;
  date: string;

  tabsPage: TabsPage;
  menuPage: MenuPage;
  private midataService: MidataService;

  tabBarElement: any;

  selectedCard: Boolean = false;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, midataService: MidataService, private matomoTracker: MatomoTracker) {
    //Here we can intialize all of the attributes which are selected and altered

    this.midataService = midataService;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    this.group = new FormGroup({
      sleepTime: new FormControl('', [Validators.required]),
      awakeTime: new FormControl('', [Validators.required]),
      sleepQuality: new FormControl('', [Validators.required]),
      eatingHabit: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required])
    })

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
    this.matomoTracker.trackPageView("Mein Tag View besucht");


    //initialize default values
    //inititalize sleeptime with a default value of last night 22:00 
    let time = new Date();
    time.setDate(time.getDate() - 1);
    time.setHours(23);
    time.setMinutes(0);
    this.sleepTime = time.toISOString();

    //Initialize awake time in todays date at 08:00 
    let time2 = new Date();
    time2.setHours(9);
    time2.setMinutes(0);
    this.awakeTime = time2.toISOString();

    this.date = new Date().toISOString();

    this.sleepQuality = 5;
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'flex';
  }

  showText() {
    if (this.selectedCard == false) {
      this.selectedCard = true;
      //tracking event
      this.matomoTracker.trackEvent("Page: Mein Tag", "card 1 klick: Schlafrhythmus")
    } else {
      this.selectedCard = false;
    }
  }

  showText2() {
    // if (this.selectedCard2 == false) {
    //   this.selectedCard2 = true;
    //tracking event
    this.matomoTracker.trackEvent("Page: Mein Tag", "card 2 klick: Essverhalten")
    // } else {
    //   this.selectedCard2 = false;
    // }
  }

  showCheckbox() {
    //track event
    this.matomoTracker.trackEvent("Page: Mein Tag", "Save Button klick")

    if (this.eatingHabit == null) {
      this.alertCtrl.create({
        message: "Bitte gib dein Essverhalten an",
        buttons: ['OK']
      }).present()
    } else if (this.selectedCard == false) {
      this.alertCtrl.create({
        message: "Bitte gib dein Schlafrythmus an",
        buttons: ['OK']
      }).present()
    } else if (this.midataService.loggedIn()) {
      //track event
      this.matomoTracker.trackEvent("Page: Mein Tag", "Save success")

      let alert = this.alertCtrl.create({
        cssClass: 'reset',
        message: 'Hattest du sonstige Beschwerden?'
      });
      alert.setTitle('Daten wurden erfolgreich in deinem MIDATA Konto gespeichert');

      alert.addInput({
        type: 'radio',
        label: 'Nein',
        value: 'value1'
      });

      alert.addInput({
        type: 'radio',
        label: 'Ja, möchte ich noch eintragen',
        value: 'value2'
      });

      alert.addInput({
        type: 'radio',
        label: 'Dafür habe ich keine Zeit',
        value: 'value3'
      });

      alert.addButton({
        text: 'Weiter',
        handler: data => {
          console.log('Checkbox data:', data);
          if (data == "value1") {
            this.navCtrl.push(HomePage)
            //track event
            this.matomoTracker.trackEvent("Page: Mein Tag", "Nein, Keine sonstigen Beschwerden")
            // this.navCtrl.parent.select(0);
          }
          if (data == "value2") {
            this.navCtrl.push(NewAttackPage) //navigate the tab does not function
            //track event
            this.matomoTracker.trackEvent("Page: Mein Tag", "Ja, Möchte Beschwerden noch eintragen")
            // this.navCtrl.parent.select(2);
          }
          if (data == "value3") {
            this.navCtrl.push(HomePage)
            //track event
            this.matomoTracker.trackEvent("Page: Mein Tag", "Habe keine Zeit meine Beschwerden einzutragen")
            // this.navCtrl.parent.select(0);
          }
        }
      });
      alert.present();

      //========================= START JSON for Observation = Sleep Rythm ===========================================
      if (this.sleepTime != null && this.awakeTime != null && this.selectedCard == true) {
        //track event
        this.matomoTracker.trackEvent("Page: Mein Tag", "Klick: Einschlafzeit und Aufwachzeit ausgewählt")

        let coding1 = {
          coding: [{
            system: 'http://loinc.org',
            code: '65554-8',
            display: 'sleep/wakeup-duration'
          }]
        }

        let category1 = {
          coding: [{
            system: 'http://hl7.org/fhir/observation-category',
            code: 'survey',
            display: 'Survey'
          }],
        }

        let entry1 = new Observation({
          effectiveDateTime: new Date().toISOString()
        }, "preliminary", category1, coding1);

        // date calculation
        let chosenFromDate = new Date(this.sleepTime)
        chosenFromDate.setTime(chosenFromDate.getTime() + chosenFromDate.getTimezoneOffset() * 60 * 1000);
        let chosenUntilDate = new Date(this.awakeTime);
        chosenUntilDate.setTime(chosenUntilDate.getTime() + chosenUntilDate.getTimezoneOffset() * 60 * 1000);

        // finish date calculation
        entry1.addProperty("effectivePeriod", {
          start: chosenFromDate.toISOString(),
          end: chosenUntilDate.toISOString()
        });

        entry1.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "248254009",
              display: "Sleep pattern finding"
            }]
          },
          valueQuantity: {
            value: this.sleepQuality
          }
        })

        if (this.date != null) {
          //track event
          this.matomoTracker.trackEvent("Page: Mein Tag", "Klick: Datum der Eingabe ausgewählt")

          entry1.addComponent({
            code: {
              coding: [{
                display: "Date of entry"
              }]
            },
            valueString: this.date
          })
        }

        let bundle1 = new Bundle("transaction");
        bundle1.addEntry("POST", entry1.resourceType, entry1);
        this.midataService.save(bundle1);
      }
      //========================= END JSON for Observation = Sleep Rythm===========================================

      //========================= START JSON FOR THE OBSERVATION "Eating Habit"================================
      let codingStuff2 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '364645004',
          display: 'Eating feeding / drinking observable'
        }]
      }

      let category2 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      let entry2 = new Observation({
        effectiveDateTime: this.date
      }, "preliminary", category2, codingStuff2);

      // let asdf = undefined;
      // if (typeof asdf === "undefined")

      if (this.eatingHabit != null) {
        //track event
        this.matomoTracker.trackEvent("Page: Mein Tag", "Klick: Essverhalten ausgewählt")

        if (this.eatingHabit.match("Regelmässig gegessen")) {
          entry2.addProperty("valueCodeableConcept", {
            coding: [{
              system: 'http://snomed.info/sct',
              code: '289141003',
              display: 'Eats regularly'
            }]
          });
        }

        if (this.eatingHabit.match("Unregelmässig gegessen")) {
          entry2.addProperty("valueCodeableConcept", {
            coding: [{
              system: 'http://snomed.info/sct',
              code: '225526009',
              display: 'Eats irregularly'
            }]
          });
        }

        if (this.eatingHabit.match("Unbestimmtes Essverhalten")) {
          entry2.addProperty("valueCodeableConcept", {
            coding: [{
              system: 'http://snomed.info/sct',
              code: '702970004',
              display: 'Eating habit unknown'
            }]
          });
        }

        if (this.date != null) {
          //track event
          this.matomoTracker.trackEvent("Page: Mein Tag", "Klick: Datum der Eingabe ausgewählt")
        }

        let bundle2 = new Bundle("transaction");
        bundle2.addEntry("POST", entry2.resourceType, entry2);
        this.midataService.save(bundle2);
      }
      //========================= END JSON FOR THE OBSERVATION "Eating Habit"================================

      //update the input fields 
      //inititalize sleeptime with a default value of last night 22:00 
      let time = new Date();
      time.setDate(time.getDate() - 1);
      time.setHours(23);
      time.setMinutes(0);
      this.sleepTime = time.toISOString();
      //Initialize awake time in todays date at 08:00 
      let time2 = new Date();
      time2.setHours(9);
      time2.setMinutes(0);
      this.awakeTime = time2.toISOString();
      //date
      this.date = new Date(new Date().getTime()).toISOString();
      (this.eatingHabit != null) ? this.eatingHabit = null: null;
      this.selectedCard = false;

      this.sleepQuality = 5;

    } else {

      let alert2 = this.alertCtrl.create({
        message: 'Bitte melde dich in MIDATA an'
      });
      alert2.setTitle('Anmeldung erforderlich');

      alert2.addButton('Abbrechen');
      alert2.addButton({
        text: 'Weiter',
        handler: data => {
          console.log('Checkbox data:', data);
          this.navCtrl.push(LoginPage);
          //   this.menuPage.openPage(this.menuPage.pages[0])
          let elements = document.querySelectorAll(".tabbar");

          if (elements != null) {
            Object.keys(elements).map((key) => {
              elements[key].style.display = 'none';
            });
          }
        }
      });
      alert2.present();
    }
  }

  /*
  swipe function
  2 = nach rechts swipen
  4 = nach links swipen
  parent.selecht(x): 0 = Home, 1 = Mein Tag, 2 = Neuer Eintrag 
  */
  swipe(event) {
    if (event.direction === 2) { // 2 = nach rechts swipen
      this.navCtrl.parent.select(2);
      //track event 
      this.matomoTracker.trackEvent("Page: Mein Tag", "Slide to Neuer Eintrag View")
    } else if (event.direction === 4) { // 4 = nach links swipen
      this.navCtrl.parent.select(0);
      //track event 
      this.matomoTracker.trackEvent("Page: Mein Tag", "Slide to Home View")
    }
  }
}
