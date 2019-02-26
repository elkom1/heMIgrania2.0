import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
  AlertController
} from 'ionic-angular';
import {
  MidataService
} from '../../services/midataService';
import {
  Observation,
  Bundle
} from 'Midata';

@Component({
  selector: 'page-menu_Diagnosen',
  templateUrl: 'menu_Diagnosen.html'
})
export class Diagnosen {

  date = Date; 
  diagnosen: string; 
  otherDiagnose: string; 

  selectedOther = false;

  private midataService: MidataService;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, midataService: MidataService) {
    this.midataService = midataService;
  }

  onChangeDiagnoses() {
    this.selectedOther = this.diagnosen.match("Andere") ? true : false
    }

  presentAlert() {
    let alert = this.alertCtrl.create({
      message: 'Deine Diagnose wurde gespeichert',
      buttons: ['OK']
    });
    alert.present();

    //========================= START JSON FOR THE OBSERVATION "Diagnosis"================================
    let codingStuff2 = {
      coding: [{
        system: 'http://snomed.info/sct',
        code: '418138009',
        display: 'Diagnosis' //muss noch registriert werden
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

    if (this.diagnosen != null) {

      if (this.diagnosen.match("Migräne mit Aura")) {
        entry2.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://hl7.org/fhir/sid/icd-10',
            code: 'G43.1',
            display: "Migräne mit Aura"
          }]
        });
      }

      if (this.diagnosen.match("Migräne ohne Aura")) {
        entry2.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://hl7.org/fhir/sid/icd-10',
            code: 'G43.0',
            display: "Migräne ohne Aura"
          }]
        });
      }

      if (this.diagnosen.match("Typische Aura mit Migränekopfschmerz")) {
        entry2.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://hl7.org/fhir/sid/icd-10',
            code: 'G43.10',
            display: "Typische Aura mit Migränekopfschmerz"
          }]
        });
      }

      if (this.diagnosen.match("Typische Aura mit Kopfschmerzen, die nicht einer Migräne entsprechen")) {
        entry2.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://hl7.org/fhir/sid/icd-10',
            code: 'G43.10',
            display: "Typische Aura mit Kopfschmerzen, die nicht einer Migräne entsprechen"
          }]
        });
      }

      if (this.diagnosen.match("Typische Aura ohne Kopfschmerz")) {
        entry2.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://hl7.org/fhir/sid/icd-10',
            code: 'G43.104',
            display: "Typische Aura ohne Kopfschmerz"
          }]
        });
      }

      if (this.diagnosen.match("Familiäre hemiplegische Migräne")) {
        entry2.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://hl7.org/fhir/sid/icd-10',
            code: 'G43.105',
            display: "Familiäre hemiplegische Migräne"
          }]
        });
      }

      if (this.diagnosen.match("Sporadische hemiplegische Migräne")) {
        entry2.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://hl7.org/fhir/sid/icd-10',
            code: 'G43.105',
            display: "Sporadische hemiplegische Migräne"
          }]
        });
      }

      if(this.diagnosen.match("Andere")) {
        entry2.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '74964007',
            display: this.otherDiagnose
          }]
        });
      }

      if (this.date != null) {
        entry2.addComponent({
          code: {
            coding: [{
              display: "Date of diagnosis"
            }]
          },
          valueDateTime: "" + this.date
        })
      }

      let bundle2 = new Bundle("transaction");
      bundle2.addEntry("POST", entry2.resourceType, entry2);
      this.midataService.save(bundle2);
    }
    //========================= END JSON FOR THE OBSERVATION "Diagnosis"================================

    //update fields
    this.date = null; 
    this.diagnosen = null; 
    this.otherDiagnose = null; 
    this.selectedOther = false; 
  }
}
