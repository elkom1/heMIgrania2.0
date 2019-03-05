import {
  Component
} from '@angular/core';
import {
  NavController,
  DateTime,
  Platform
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


@Component({
  selector: 'page-myDay',
  templateUrl: 'myDayPage.html'
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
  private midataService: MidataService;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, midataService: MidataService, private platform: Platform) {
    //Here we can intialize all of the attributes which are selected and altered
    this.group = new FormGroup({
      sleepTime: new FormControl('', [Validators.required]),
      awakeTime: new FormControl('', [Validators.required]),
      sleepQuality: new FormControl('', [Validators.required]),
      eatingHabit: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
    })
    this.midataService = midataService;
  }

  ngAfterViewInit() {
    this.sleepTime = new Date(new Date().getTime() - 82800000).toISOString();
    this.awakeTime = new Date(new Date().getTime() - 3600000).toISOString();
    this.date = new Date(new Date().getTime()).toISOString();
  }

  showCheckbox() {

    if (this.midataService.loggedIn()) {

      let alert = this.alertCtrl.create();
      alert.setTitle('Hattest du sonstige Beschwerden ?');

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

      alert.addButton('Abbrechen');
      alert.addButton({
        text: 'Bestätigen',
        handler: data => {
          console.log('Checkbox data:', data);
          if (data == "value1") {
            this.navCtrl.push(HomePage)
          }
          if (data == "value2") {
            this.navCtrl.push(NewAttackPage) //navigate the tab does not function
          }
          if (data == "value3") {
            this.navCtrl.push(HomePage)
          }
        }
      });
      alert.present();

      //========================= START JSON for Observation = Sleep Rythm ===========================================
      if (this.sleepTime != null && this.awakeTime != null) {
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
          _dateTime: new Date().toISOString()
        }, coding1, category1);

        entry1.addProperty("effectivePeriod", {
          start: this.sleepTime,
          end: this.awakeTime
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
          entry1.addComponent({
            code: {
              coding: [{
                display: "Date of entry"
              }]
            },
            valueDateTime: "" + this.date
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
        _dateTime: new Date().toISOString()
      }, codingStuff2, category2);

      // let asdf = undefined;
      // if (typeof asdf === "undefined")

      if (!this.eatingHabit) {
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
          entry2.addComponent({
            code: {
              coding: [{
                display: "Date of entry"
              }]
            },
            valueDateTime: "" + this.date
          })
        }

        let bundle2 = new Bundle("transaction");
        bundle2.addEntry("POST", entry2.resourceType, entry2);
        this.midataService.save(bundle2);
      }
      //========================= END JSON FOR THE OBSERVATION "Eating Habit"================================

      //update the input fields 
      (this.sleepTime != null) ? this.sleepTime = null: null;
      (this.awakeTime != null) ? this.awakeTime = null: null;
      (this.sleepQuality != null) ? this.sleepQuality = null: null;
      (this.eatingHabit != null) ? this.eatingHabit = null: null;
      (this.date != null) ? this.date = null: null;


    } else {

      let alert2 = this.alertCtrl.create();
      alert2.setTitle('Bittel melde dich in MIDATA an');

      alert2.addInput({
        type: 'radio',
        label: 'Anmelden',
        checked: true,
        value: 'value1'
      });

      alert2.addButton('Abbrechen');
      alert2.addButton({
        text: 'Bestätigen',
        handler: data => {
          console.log('Checkbox data:', data);
          if (data == "value1") {
            this.navCtrl.push(LoginPage)
          }
        }
      });
      alert2.present();
    }
  }
}
