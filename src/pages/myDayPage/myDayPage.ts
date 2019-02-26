import {
  Component
} from '@angular/core';
import {
  NavController,
  DateTime
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


@Component({
  selector: 'page-myDay',
  templateUrl: 'myDayPage.html'
})
export class MyDayPage {
  testCheckboxOpen = false;

  group: FormGroup;

  sleepTime: DateTime;
  awakeTime: DateTime;
  sleepQuality: number = 0;
  eatingHabit: string;
  exercises: string[];
  date: Date;

  tabsPage: TabsPage;
  private midataService: MidataService;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, midataService: MidataService) {
    //Here we can intialize all of the attributes which are selected and altered
    this.group = new FormGroup({
      sleepTime: new FormControl(''),
      awakeTime: new FormControl(''),
      sleepQuality: new FormControl(''),
      eatingHabit: new FormControl(''),
      exercises: new FormControl(''),
      date: new FormControl(''),
    })
    this.midataService = midataService;
  }


  showCheckbox() {
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

    if (this.eatingHabit != null) {
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

    //========================= START JSON FOR THE OBSERVATION "Relaxation Exercises"================================
    let codingStuff3 = {
      coding: [{
        system: 'http://snomed.info/sct',
        code: '418138009',
        display: 'Relaxation Exercises' // muss noch registriert werden 
      }]
    }

    let category3 = {
      coding: [{
        system: 'http://hl7.org/fhir/observation-category',
        code: 'survey',
        display: 'Survey'
      }],
    }

    //Observation1: Exercise 1 
    if (this.exercises.find(val => val == "übung 1") != null) {
      let entry3 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff3, category3);

      entry3.addProperty("valueCodeableConcept", {
        coding: [{
          system: "",
          code: "",
          display: 'Exercise 1'
        }]
      });

      if (this.date != null) {
        entry3.addComponent({
          code: {
            coding: [{
              display: "Date of entry"
            }]
          },
          valueDateTime: "" + this.date
        })
      }

      let bundle3 = new Bundle("transaction");
      bundle3.addEntry("POST", entry3.resourceType, entry3);
      this.midataService.save(bundle3);
    }
    //Observation2: Exercise 2
    if (this.exercises.find(val => val == "übung 2") != null) {
      let entry3_1 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff3, category3);

      entry3_1.addProperty("valueCodeableConcept", {
        coding: [{
          system: "",
          code: "",
          display: 'Exercise 2'
        }]
      });

      if (this.date != null) {
        entry3_1.addComponent({
          code: {
            coding: [{
              display: "Date of entry"
            }]
          },
          valueDateTime: "" + this.date
        })
      }

      let bundle3_1 = new Bundle("transaction");
      bundle3_1.addEntry("POST", entry3_1.resourceType, entry3_1);
      this.midataService.save(bundle3_1);
    }
    //Observation3: Exercise 3
    if (this.exercises.find(val => val == "übung 3") != null) {
      let entry3_2 = new Observation({
        _dateTime: new Date().toISOString()
      }, codingStuff3, category3);

      entry3_2.addProperty("valueCodeableConcept", {
        coding: [{
          system: "",
          code: "",
          display: 'Exercise 3'
        }]
      });

      if (this.date != null) {
        entry3_2.addComponent({
          code: {
            coding: [{
              display: "Date of entry"
            }]
          },
          valueDateTime: "" + this.date
        })
      }

      let bundle3_2 = new Bundle("transaction");
      bundle3_2.addEntry("POST", entry3_2.resourceType, entry3_2);
      this.midataService.save(bundle3_2);
    }
    //========================= END JSON FOR THE OBSERVATION "Relaxation Exercises"================================

    //update the input fields 
    (this.sleepTime != null) ? this.sleepTime = null: null;
    (this.awakeTime != null) ? this.awakeTime = null: null;
    (this.sleepQuality != null) ? this.sleepQuality = null: null;
    (this.eatingHabit != null) ? this.eatingHabit = null: null;
    (this.exercises != null) ? this.exercises = null: null;
    (this.date != null) ? this.date = null: null;

  }
}
