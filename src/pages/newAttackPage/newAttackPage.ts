import {
  Component,
  ChangeDetectionStrategy,
  ViewChild
} from '@angular/core';
import {
  NavController, Content
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
  MidataService
} from '../../services/midataService';
import {
  Observation,
  Bundle,
  MedicationStatement
} from 'Midata';
import {
  BarcodeScanner
} from '@ionic-native/barcode-scanner';
import {
  medicationStatus,
  medicationTaken
} from 'Midata/dist/src/resources/MedicationStatement';
import {
  LoginPage
} from '../login/login';
import {
  MatomoTracker
} from 'ngx-matomo';


@Component({
  selector: 'page-newAttack',
  templateUrl: 'newAttackPage.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewAttackPage {
  @ViewChild(Content) content: Content;

  //-------------------------------------START INITIALIZE ITEMS -------------------------------------------------
  situation: string;
  symptome: string[];
  otherSymptom: string;
  painAreal: string;
  painType: string;
  otherPainType: string;
  fromDateTime: string;
  untilDateTime: string;
  intensity: number = 0;
  medicament: string;
  menge: number = 0;
  medEffect: string;

  required = false;

  intensityWateryEye: number = 0;
  intensityRedEye: number = 0;
  intensityNasenLaufen: number = 0;
  intensityNasenVerstopfung: number = 0;
  intensityFlimmerSehen: number = 0;
  intensityPhotophobia: number = 0;
  intensityPhonophobia: number = 0;
  intensityTouchSensation: number = 0;
  intensitySpeechDisorder: number = 0;
  intensitySmellSensitivity: number = 0;
  intensityVomiting: number = 0;
  intensityNausea: number = 0;

  selectedOther = false;
  selectedOther3 = false;
  selectedOther4 = false;
  selectedHeadache = false;
  selectedWateryEye = false;
  selectedRedEye = false;
  selectedNasenLaufen = false;
  selectedNasenVerstopfung = false;
  selectedFlimmerSehen = false;
  selectedPhotophobia = false;
  selectedPhonophobia = false;
  selectedTouchSensation = false;
  selectedSpeechDisorder = false;
  selectedSmellSensitivity = false;
  selectedVomiting = false;
  selectedNausea = false;

  group: FormGroup;

  searchQuery: string = '';
  items: string[];

  showList: boolean = false;
  private midataService: MidataService;

  encodeText: string = '';

  tabBarElement: any;

  selectedCard: Boolean = false;
  selectedCard2: Boolean = false;
  selectedCard3: Boolean = false;
  //-------------------------------------END INITIALIZE ITEMS -------------------------------------------------


  //-------------------------------------START CONSTRUCTOR ----------------------------------------------------
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, midataService: MidataService, private scanner: BarcodeScanner, private matomoTracker: MatomoTracker) {
    //Here we can intialize all of the attributes which are selected and altered
    this.group = new FormGroup({
      menge: new FormControl('', [Validators.required, Validators.max(15)]),
      symptome: new FormControl('', [Validators.required, Validators.minLength(1)]),
      otherSymptom: new FormControl('', [Validators.required, Validators.minLength(4)]),
      painAreal: new FormControl('', [Validators.required]),
      painType: new FormControl('', [Validators.required]),
      otherPainType: new FormControl('', [Validators.required]),
      fromDateTime: new FormControl('', [Validators.required]),
      untilDateTime: new FormControl('', [Validators.required]),
      intensity: new FormControl('', [Validators.required]),
      medicament: new FormControl(''),
      medEffect: new FormControl(''),
      situation: new FormControl('', [Validators.required]),
      intensityWateryEye: new FormControl('', [Validators.required]),
      intensityRedEye: new FormControl('', [Validators.required]),
      intensityNasenLaufen: new FormControl('', [Validators.required]),
      intensityNasenVerstopfung: new FormControl('', [Validators.required]),
      intensityFlimmerSehen: new FormControl('', [Validators.required]),
      intensityPhonophobia: new FormControl('', [Validators.required]),
      intensityPhotophobia: new FormControl('', [Validators.required]),
      intensityTouchSensation: new FormControl('', [Validators.required]),
      intensitySpeechDisorder: new FormControl('', [Validators.required]),
      intensitySmellSensitivity: new FormControl('', [Validators.required]),
      intensityVomiting: new FormControl('', [Validators.required]),
      intensityNausea: new FormControl('', [Validators.required]),

    })
    this.symptome = [];

    this.midataService = midataService;
    this.initializeItems();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }
  //-------------------------------------END CONSTRUCTOR ----------------------------------------------------

  ngAfterViewInit() {}

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
    this.matomoTracker.trackPageView("Neuer Eintrag View besucht");

    // set default values
    this.menge = 1;
    this.fromDateTime = new Date(new Date().getTime() - 14400000).toISOString();
    this.untilDateTime = new Date(new Date().getTime() - 3600000).toISOString();

    this.intensity = 5; 
    this.intensityFlimmerSehen = 5; 
    this.intensityNasenLaufen = 5; 
    this.intensityNasenVerstopfung = 5; 
    this.intensityNausea = 5; 
    this.intensityPhonophobia = 5; 
    this.intensityPhotophobia = 5; 
    this.intensityRedEye = 5; 
    this.intensitySmellSensitivity = 5; 
    this.intensitySpeechDisorder = 5; 
    this.intensityTouchSensation = 5; 
    this.intensityVomiting = 5; 
    this.intensityWateryEye = 5; 
    this.intensityTouchSensation = 5; 
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'flex';
  }

  //-------------------------------------START ONCHANGE METHODS FOR "OTHER SELECTION"------------------------
  onChangeSymptoms() {
    this.selectedOther = this.symptome.find(val => val == "Andere") == null ? false : true
    this.selectedHeadache = this.symptome.find(value => value == "Kopfschmerzen") == null ? false : true
    this.selectedWateryEye = this.symptome.find(value => value == "Tränende Augen") == null ? false : true
    this.selectedRedEye = this.symptome.find(value => value == "Gerötete Augen") == null ? false : true
    this.selectedNasenLaufen = this.symptome.find(value => value == "Nasenlaufen") == null ? false : true
    this.selectedNasenVerstopfung = this.symptome.find(value => value == "Nasenverstopfung") == null ? false : true
    this.selectedFlimmerSehen = this.symptome.find(value => value == "Flimmersehen") == null ? false : true
    this.selectedPhotophobia = this.symptome.find(value => value == "Lichtempfindlichkeit") == null ? false : true
    this.selectedPhonophobia = this.symptome.find(value => value == "Lärmempfindlichkeit") == null ? false : true
    this.selectedTouchSensation = this.symptome.find(value => value == "Gefühlsstörung") == null ? false : true
    this.selectedSpeechDisorder = this.symptome.find(value => value == "Sprachstörung") == null ? false : true
    this.selectedSmellSensitivity = this.symptome.find(value => value == "Geruchsempfindlichkeit") == null ? false : true
    this.selectedVomiting = this.symptome.find(value => value == "Erbrechen") == null ? false : true
    this.selectedNausea = this.symptome.find(value => value == "Übelkeit") == null ? false : true

    // track event 
    this.matomoTracker.trackEvent("Page: Neuer Eintrag", "eine Auffälligkeit ausgewählt")
  }

  onChangePainType() {
    if (this.selectedOther == true || this.selectedOther4 == true) {
      this.selectedOther3 = this.painType.match("Andere") ? true : false
    }
    this.selectedOther3 = this.painType.match("Andere") ? true : false
  }
  //-------------------------------------END ONCHANGE METHODS FOR "OTHER SELECTION"------------------------

  showText() {
    // if (this.selectedCard == false) {
    //   this.selectedCard = true;
      //tracking event
      this.matomoTracker.trackEvent("Page: Neuer Eintrag", "card 1 klick: Auffälligkeiten")
    // } else {
    //   this.selectedCard = false;
    // }
  }

  showText2() {
    if (this.selectedCard2 == false) {
      this.selectedCard2 = true;
      //tracking event
      this.matomoTracker.trackEvent("Page: Neuer Eintrag", "card 2 klick: Dauer des Schmerzes")
    } else {
      this.selectedCard2 = false;
    }
  }

  showText3() {
    if (this.selectedCard3 == false) {
      this.selectedCard3 = true;
      //Scroll up after click 
      this.content.scrollToBottom();
      this.content.scrollTo(0, 1000);
      //tracking event
      this.matomoTracker.trackEvent("Page: Neuer Eintrag", "card 3 klick: Medikamente")
    } else {
      this.selectedCard3 = false;
    }
  }

  //-------------------------------------START METHODS FOR MEDICATION SEARCH-------------------------------
  initializeItems() {
    this.items = [
      'Dafalgan 1000mg',
      'Dafalgan 500mg',
      'Dafalgan 200mg',
      'Ibuprofen 400mg',
      'Ibuprofen 800mg',
      'Diclofenac 25mg',
      'Diclofenac 50mg'
    ];
  }

  chooseMedicament(item) {
    this.medicament = item;
    //hide 
    this.items.splice(item)
    //tracking event
    this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Ein Medikamente aus der Liste ausgewählt")
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {

      // Filter the items
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });

      // Show the results
      this.showList = true;
    } else {

      // hide the results when the query is empty
      this.showList = false;
    }
  }

  scan() {

    let alert2 = this.alertCtrl.create({
      message: "heMIgrania möchte gerne auf deine Kamera zugreifen," + "<br/>" + "um die GTIN Nummer aus dem Barcode Scanner auszulesen"
    });
    alert2.setTitle("Kamerazugriff");

    alert2.addButton('Abbrechen');
    alert2.addButton({
      text: 'Weiter',
      handler: () => {
        this.scanner.scan().then((data) => {
          if (data.cancelled) {
            let scannerAlert = this.alertCtrl.create({
              message: data.text + "Es wurde kein Scan durchgeführt",
              buttons: ['OK']
            });
            scannerAlert.present();

            //track event
            this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Scan nicht erfolgreich")
          } else {
            let scannerAlert = this.alertCtrl.create({
              message: data.text + "<br/>" + "Scan war erfolgreich",
              buttons: ['OK']
            });
            scannerAlert.present();

            //track event
            this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Scan war erfolgreich");

            (this.medicament == null || this.medicament != null) ? this.medicament = data.text: ""
          }
          //track event just click the scan button 
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Scan Button geklickt")

        }).catch(err => {
          console.log('Error', err);
        });
      }
    });
    alert2.present();

  }

  addMedicament() {
    //track event
    this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Add Medicament Button geklickt");

    if (this.midataService.loggedIn()) {

      let addMedAlert = this.alertCtrl.create({
        message: (this.medicament != null && this.menge >= 1) ? this.medicament + "<br/>" + "wurde gespeichert" + "<br/>" + "<br/>" + "Du kannst noch weitere Medikamente hinzufügen" : "Du hast noch kein Medikament erfasst"
      });
      addMedAlert.addButton({
        text: "Ok",
        handler: () => {
          //track events
          (this.medicament != null && this.menge >= 1) ? this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Add Medicament persistence success"):
            this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Add Medicament persistence failed (keine Medikamente erfasst!)")
        }
      })
      addMedAlert.present();

      //========================= START JSON FOR THE MEDICATION STATEMENT================================
      if (this.medicament != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Medikament im Suchfeld erfasst ")

        let code = {
          coding: [{
            system: 'http://midata.coop	',
            code: 'Medication Name',
            display: this.medicament
          }]
        }

        let cat = {
          coding: [{
            system: "http://hl7.org/fhir/ValueSet/medication-statement-category",
            code: "patientspecified",
            display: "preferred"
          }],
        }

        let medStatus: medicationStatus = "active";

        let medTaken: medicationTaken = "y";

        let medEntry = new MedicationStatement(new Date(), code, medStatus, cat, {}, medTaken);

        if (this.medEffect != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Wirkung des Medikaments klick")

          let dosage = [{
            resourceType: "Dosage",
            doseQuantity: {
              value: this.menge
            },
            text: (this.medEffect.match("Nein")) ? "None" : (this.medEffect.match("Ja")) ?
              "Good" : (this.medEffect.match("Hat sich verschlimmert")) ?
              "Bad" : ""
          }]
          medEntry.addProperty("dosage", dosage);
        }

        if (this.medEffect == null) {
          let dosage = [{
            resourceType: "Dosage",
            doseQuantity: {
              value: this.menge
            }
          }]
          medEntry.addProperty("dosage", dosage);
        }

        let bundle2 = new Bundle("transaction");
        bundle2.addEntry("POST", medEntry.resourceType, medEntry);
        this.midataService.save(bundle2);

        //update the medication fields 
        this.medicament = null;
        this.menge = 1;
        this.medEffect = null;
        this.fromDateTime = new Date().toISOString();
        this.untilDateTime = new Date().toISOString();
      }
    } else {

      let alert2 = this.alertCtrl.create();
      alert2.setTitle('Bittel melde dich in MIDATA an');

      alert2.addButton('Abbrechen');
      alert2.addButton({
        text: 'Bestätigen',
        handler: data => {
          console.log('Checkbox data:', data);
          this.navCtrl.push(LoginPage)

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
  //-------------------------------------END METHODS FOR MEDICATION SEARCH-------------------------------


  //-------------------------------- START PERSISTENCE IN MIDATA OF ALL THE INPUT FIELDS---------------------------------------------------------
  presentAlert() {

    //track event
    this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Save Button klick");

    if (this.situation == null) {
      this.alertCtrl.create({
        message: "Bitte erfasse das erste Eingabefeld",
        buttons: ['OK']
      }).present()
    }

    else if (this.group.get('symptome').hasError('required') || this.symptome == null) {
      console.log("Error: Selektiere minimum eine Auffälligkeit")
      return this.alertCtrl.create({
        message: "Bitte gib mindestens eine Auffälligkeit an",
        buttons: ['OK']
      }).present()
    }

    else if (this.selectedCard2 == false && this.symptome != null) {
      this.alertCtrl.create({
        message: "Bitte erfasse deine Schmerzdauer",
        buttons: ['OK']
      }).present()
    }

    else if (this.group.get('menge').hasError('required') && this.medicament != null) {
      console.log("Error: Anzahl Tabletten nicht richtig")
      return this.alertCtrl.create({
        message: "Bitte gib eine Zahl von 1-15",
        buttons: ['OK']
      }).present()
    }

    //Start methods for persistence the whole form when logged in 
    else if (this.midataService.loggedIn()) {

      //tracking event
      this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Complete Save Success")

      let alert = this.alertCtrl.create({
        message: 'Daten wurden erfolgreich in deinem MIDATA Konto gespeichert',
        buttons: ['OK']
      });
      alert.present();

      // //========================= START JSON ADD SITUATION COMPONENTS===========================================
      if (this.situation.match("migräneanfall")) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Was erfasst du gerade?")

        let coding1 = {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '118222006',
            display: 'General finding of observation of patient'
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

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry1.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry1.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '216299002',
            display: 'Attack'
          }]
        });

        let bundle1 = new Bundle("transaction");
        bundle1.addEntry("POST", entry1.resourceType, entry1);
        this.midataService.save(bundle1);
      } else if (this.situation.match("unwohlsein")) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Was erfasst du gerade?")
      }
      //========================= END JSON ADD SITUATION COMPONENTS=============================================


      //========================= START JSON FOR THE OBSERVATION "Headache Charachter"================================
      if (this.symptome.find(val => val == "Kopfschmerzen") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let codingStuff = {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '162306000',
            display: 'Headache Character'
          }]
        }

        let category = {
          coding: [{
            system: 'http://hl7.org/fhir/observation-category',
            code: 'survey',
            display: 'Survey'
          }],
        }

        let entry = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff, category);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        if (this.painAreal != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzareal ausgewählt")

          if (this.painAreal.match("Kopf rechtsseitig")) {
            entry.addProperty("bodySite", {
              coding: [{
                system: 'http://snomed.info/sct',
                code: '29624005',
                display: 'Right side of head'
              }]
            });
          }

          if (this.painAreal.match("Kopf linksseitig")) {
            entry.addProperty("bodySite", {
              coding: [{
                system: 'http://snomed.info/sct',
                code: '64237003',
                display: 'Left side of head'
              }]
            });
          }

          if (this.painAreal.match("Kopf beidseitig")) {
            entry.addProperty("bodySite", {
              coding: [{
                system: 'http://snomed.info/sct',
                code: '162301005',
                display: 'Bilateral headache'
              }]
            });
          }
        }

        if (this.painType != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzart ausgewählt")

          if (this.painType.match("Dumpf drückender Schmerz")) {
            entry.addProperty("valueCodeableConcept", {
              coding: [{
                system: 'http://snomed.info/sct',
                code: '162307009',
                display: 'Aching headache'
              }]
            });
          }

          if (this.painType.match("Pochender Schmerz")) {
            entry.addProperty("valueCodeableConcept", {
              coding: [{
                system: 'http://snomed.info/sct',
                code: '162308004',
                display: 'Throbbing headache'
              }]
            });
          }

          if (this.painType.match("Stechender Schmerz")) {
            entry.addProperty("valueCodeableConcept", {
              coding: [{
                system: 'http://snomed.info/sct',
                code: '162309007',
                display: 'Shooting headache'
              }]
            });
          }

          if (this.painType.match("Andere")) {
            entry.addProperty("valueCodeableConcept", {
              coding: [{
                system: 'http://snomed.info/sct',
                code: '74964007',
                display: this.otherPainType
              }]
            });
          }
        }

        entry.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensity
          }
        })

        let bundle = new Bundle("transaction");
        bundle.addEntry("POST", entry.resourceType, entry);
        this.midataService.save(bundle);
      }
      //========================= END JSON FOR THE OBSERVATION "Headache Character"================================


      //========================= START JSON FOR THE OBSERVATIONS ""Clinical finding present""================================
      let codingStuff4 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '373573001',
          display: 'Clinical finding present'
        }]
      }

      let category4 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      //Observation1: Tränende Augen
      if (this.symptome.find(val => val == "Tränende Augen") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let entry4 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff4, category4);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry4.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry4.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '267092007',
            display: "Has eye discharge"
          }]
        });

        entry4.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensityWateryEye
          }
        })

        let bundle4 = new Bundle("transaction");
        bundle4.addEntry("POST", entry4.resourceType, entry4);
        this.midataService.save(bundle4);
      }
      //--------------------------------------------------------------------------------------
      //Observation2: Gerötete Augen
      if (this.symptome.find(val => val == "Gerötete Augen") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let entry4_1 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff4, category4);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry4_1.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry4_1.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '267093002',
            display: "has red eye"
          }]
        });

        entry4_1.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensityRedEye
          }
        })

        let bundle4_1 = new Bundle("transaction");
        bundle4_1.addEntry("POST", entry4_1.resourceType, entry4_1);
        this.midataService.save(bundle4_1);
      }
      //-----------------------------------------------------------------------------------------
      //Observation3: Nasenlaufen
      if (this.symptome.find(val => val == "Nasenlaufen") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let entry4_2 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff4, category4);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry4_2.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry4_2.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '267101005',
            display: "Nasal discharge present"
          }]
        });

        entry4_2.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensityNasenLaufen
          }
        })

        let bundle4_2 = new Bundle("transaction");
        bundle4_2.addEntry("POST", entry4_2.resourceType, entry4_2);
        this.midataService.save(bundle4_2);
      }
      //--------------------------------------------------------------------------------------
      //Observation4: Nasenverstopfung
      if (this.symptome.find(val => val == "Nasenverstopfung") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let entry4_3 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff4, category4);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry4_3.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry4_3.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '267100006',
            display: "Nasal obstruction present"
          }]
        });

        entry4_3.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensityNasenVerstopfung
          }
        })

        let bundle4_3 = new Bundle("transaction");
        bundle4_3.addEntry("POST", entry4_3.resourceType, entry4_3);
        this.midataService.save(bundle4_3);
      }
      //-----------------------------------------------------------------------------------------
      //Observation5: Übelkeit
      if (this.symptome.find(val => val == "Übelkeit") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let entry4_4 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff4, category4);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry4_4.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });

          entry4_4.addProperty("valueCodeableConcept", {
            coding: [{
              system: 'http://snomed.info/sct',
              code: '162057007',
              display: "Nausea present"
            }]
          });

          entry4_4.addComponent({
            code: {
              coding: [{
                system: "http://snomed.info/sct",
                code: "406127006",
                display: "Pain intensity rating scale"
              }]
            },
            valueQuantity: {
              value: this.intensityNausea
            }
          })
        }

        let bundle4_4 = new Bundle("transaction");
        bundle4_4.addEntry("POST", entry4_4.resourceType, entry4_4);
        this.midataService.save(bundle4_4);
      }
      //========================= END JSON FOR THE OBSERVATION "Clinical finding present"================================

      //========================= START JSON FOR THE OBSERVATION "Nausea and Vomiting Status"================================ 
      if (this.symptome.find(val => val == "Erbrechen") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let codingStuff4_5 = {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '405166007',
            display: 'Nausea and Vomiting Status'
          }]
        }

        let category4_5 = {
          coding: [{
            system: 'http://hl7.org/fhir/observation-category',
            code: 'survey',
            display: 'Survey'
          }],
        }

        let entry4_5 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff4_5, category4_5);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry4_5.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry4_5.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '422400008',
            display: "Vomiting"
          }]
        });

        entry4_5.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensityVomiting
          }
        })

        let bundle4_5 = new Bundle("transaction");
        bundle4_5.addEntry("POST", entry4_5.resourceType, entry4_5);
        this.midataService.save(bundle4_5);
      }
      //========================= END JSON FOR THE OBSERVATION "Nausea and Vomiting Status"================================ 

      //========================= START JSON FOR THE OBSERVATION ""Visual function""================================
      if (this.symptome.find(val => val == "Flimmersehen") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let codingStuff5 = {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '281004000',
            display: 'Visual function'
          }]
        }

        let category5 = {
          coding: [{
            system: 'http://hl7.org/fhir/observation-category',
            code: 'survey',
            display: 'Survey'
          }],
        }

        let entry5 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff5, category5);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry5.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry5.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '73905001',
            display: "Sees flickering lights"
          }]
        });

        entry5.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensityFlimmerSehen
          }
        })

        let bundle5 = new Bundle("transaction");
        bundle5.addEntry("POST", entry5.resourceType, entry5);
        this.midataService.save(bundle5);
      }
      //========================= END JSON FOR THE OBSERVATION ""Visual function""================================

      //========================= START JSON FOR THE OBSERVATION ""General reaction to light""================================
      if (this.symptome.find(val => val == "Lichtempfindlichkeit") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let codingStuff6 = {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '246613004',
            display: 'General reaction to light'
          }]
        }

        let category6 = {
          coding: [{
            system: 'http://hl7.org/fhir/observation-category',
            code: 'survey',
            display: 'Survey'
          }],
        }

        let entry6 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff6, category6);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry6.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry6.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '409668002',
            display: "Photophobia"
          }]
        });

        entry6.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensityPhotophobia
          }
        })

        let bundle6 = new Bundle("transaction");
        bundle6.addEntry("POST", entry6.resourceType, entry6);
        this.midataService.save(bundle6);
      }
      //========================= END JSON FOR THE OBSERVATION ""General reaction to light""================================

      //========================= START JSON FOR THE OBSERVATION ""Emotion""================================
      let codingStuff7 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '285854004',
          display: 'Emotion'
        }]
      }

      let category7 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      //Observation: Phonophobia
      if (this.symptome.find(val => val == "Lärmempfindlichkeit") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let entry7 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff7, category7);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry7.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry7.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '313387002',
            display: "Phonophobia"
          }]
        });

        entry7.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensityPhonophobia
          }
        })

        let bundle7 = new Bundle("transaction");
        bundle7.addEntry("POST", entry7.resourceType, entry7);
        this.midataService.save(bundle7);
      }

      //Observation: Erholung
      if (this.symptome.find(val => val == "Erholung") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let entry7_1 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff7, category7);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry7_1.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry7_1.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '102894008',
            display: "Feeling calm"
          }]
        });

        let bundle7_1 = new Bundle("transaction");
        bundle7_1.addEntry("POST", entry7_1.resourceType, entry7_1);
        this.midataService.save(bundle7_1);
      }
      //========================= END JSON FOR THE OBSERVATION ""Emotion""================================

      //========================= START JSON FOR THE OBSERVATION ""Altered sensation of skin""================================
      if (this.symptome.find(val => val == "Gefühlsstörung") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let codingStuff8 = {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '247325003',
            display: 'Altered sensation of skin'
          }]
        }

        let category8 = {
          coding: [{
            system: 'http://hl7.org/fhir/observation-category',
            code: 'survey',
            display: 'Survey'
          }],
        }

        let entry8 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff8, category8);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry8.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry8.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '279079003',
            display: "Dysesthesia"
          }]
        });

        entry8.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensityTouchSensation
          }
        })

        let bundle8 = new Bundle("transaction");
        bundle8.addEntry("POST", entry8.resourceType, entry8);
        this.midataService.save(bundle8);
      }
      //========================= END JSON FOR THE OBSERVATION ""Altered sensation of skin""================================

      //========================= START JSON FOR THE OBSERVATION ""Speech observable""================================
      if (this.symptome.find(val => val == "Sprachstörung") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let codingStuff9 = {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '363918005',
            display: 'Speech observable'
          }]
        }

        let category9 = {
          coding: [{
            system: 'http://hl7.org/fhir/observation-category',
            code: 'survey',
            display: 'Survey'
          }],
        }

        let entry9 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff9, category9);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry9.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry9.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '29164008',
            display: "Speech impairment"
          }]
        });

        entry9.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensitySpeechDisorder
          }
        })

        let bundle9 = new Bundle("transaction");
        bundle9.addEntry("POST", entry9.resourceType, entry9);
        this.midataService.save(bundle9);
      }
      //========================= END JSON FOR THE OBSERVATION ""Speech observable""================================

      //========================= START JSON FOR THE OBSERVATION ""Sense of smell""================================
      if (this.symptome.find(val => val == "Geruchsempfindlichkeit") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let codingStuff10 = {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '397686008',
            display: 'Sense of smell, function'
          }]
        }

        let category10 = {
          coding: [{
            system: 'http://hl7.org/fhir/observation-category',
            code: 'survey',
            display: 'Survey'
          }],
        }

        let entry10 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff10, category10);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry10.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry10.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '45846002',
            display: "Sensitive to smells"
          }]
        });

        entry10.addComponent({
          code: {
            coding: [{
              system: "http://snomed.info/sct",
              code: "406127006",
              display: "Pain intensity rating scale"
            }]
          },
          valueQuantity: {
            value: this.intensitySmellSensitivity
          }
        })

        let bundle10 = new Bundle("transaction");
        bundle10.addEntry("POST", entry10.resourceType, entry10);
        this.midataService.save(bundle10);
      }
      //========================= END JSON FOR THE OBSERVATION ""Sense of smell""================================

      //========================= START JSON FOR THE OBSERVATION ""Mental state, behavior""================================
      let codingStuff11 = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '363870007',
          display: 'Mental state, behavior / psychosocial function observable'
        }]
      }

      let category11 = {
        coding: [{
          system: 'http://hl7.org/fhir/observation-category',
          code: 'survey',
          display: 'Survey'
        }],
      }

      //Observation: Stress
      if (this.symptome.find(val => val == "Stress") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let entry11 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff11, category11);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry11.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry11.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '73595000',
            display: "Stress"
          }]
        });

        let bundle11 = new Bundle("transaction");
        bundle11.addEntry("POST", entry11.resourceType, entry11);
        this.midataService.save(bundle11);
      }
      //-----------------------------------------------------------------------------
      //Observation: Leseschwäche
      if (this.symptome.find(val => val == "Leseschwäche") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let entry11_1 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff11, category11);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry11_1.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry11_1.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '309253009',
            display: "Difficulty reading"
          }]
        });

        let bundle11_1 = new Bundle("transaction");
        bundle11_1.addEntry("POST", entry11_1.resourceType, entry11_1);
        this.midataService.save(bundle11_1);
      }

      //========================= END JSON FOR THE OBSERVATION ""Mental state, behavior""================================

      //========================= START JSON FOR THE OBSERVATION ""Female reproductive function""================================
      if (this.symptome.find(val => val == "Menstruation") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let codingStuff12 = {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '66523006',
            display: 'Female reproductive function'
          }]
        }

        let category12 = {
          coding: [{
            system: 'http://hl7.org/fhir/observation-category',
            code: 'survey',
            display: 'Survey'
          }],
        }

        let entry12 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff12, category12);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry12.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry12.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '276319003',
            display: "Menstruation finding"
          }]
        });

        let bundle12 = new Bundle("transaction");
        bundle12.addEntry("POST", entry12.resourceType, entry12);
        this.midataService.save(bundle12);
      }
      //========================= END JSON FOR THE OBSERVATION ""Female reproductive function""================================

      //========================= START JSON FOR THE OBSERVATION ""Other Symptoms""================================
      if (this.symptome.find(val => val == "Andere") != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Auffälligkeiten ausgewählt")

        let codingStuff13 = {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '418138009',
            display: 'Other Symptom' // Muss noch registriert werden 
          }]
        }

        let category13 = {
          coding: [{
            system: 'http://hl7.org/fhir/observation-category',
            code: 'survey',
            display: 'Survey'
          }],
        }

        let entry13 = new Observation({
          _dateTime: new Date().toISOString()
        }, codingStuff13, category13);

        if (this.fromDateTime != null && this.untilDateTime != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Klick: Schmerzdauer VON & BIS")

          entry13.addProperty("effectivePeriod", {
            start: this.fromDateTime,
            end: this.untilDateTime
          });
        }

        entry13.addProperty("valueCodeableConcept", {
          coding: [{
            system: 'http://snomed.info/sct',
            code: '74964007',
            display: this.otherSymptom
          }]
        });

        let bundle13 = new Bundle("transaction");
        bundle13.addEntry("POST", entry13.resourceType, entry13);
        this.midataService.save(bundle13);
      }
      //========================= END JSON FOR THE OBSERVATION ""Other Symptoms""================================

      //========================= START JSON FOR THE MEDICATION STATEMENT================================
      if (this.medicament != null) {
        //tracking event
        this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Medikament im Suchfeld erfasst")

        let code = {
          coding: [{
            system: 'http://midata.coop	',
            code: 'Medication Name',
            display: this.medicament
          }]
        }

        let cat = {
          coding: [{
            system: "http://hl7.org/fhir/ValueSet/medication-statement-category",
            code: "patientspecified",
            display: "preferred"
          }],
        }

        let medStatus: medicationStatus = "active";

        let medTaken: medicationTaken = "y";

        let medEntry = new MedicationStatement(new Date(), code, medStatus, cat, {}, medTaken);

        if (this.medEffect != null) {
          //tracking event
          this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Wirkung des Medikaments klick")

          let dosage = [{
            resourceType: "Dosage",
            doseQuantity: {
              value: this.menge
            },
            text: (this.medEffect.match("Nein")) ? "None" : (this.medEffect.match("Ja")) ?
              "Good" : (this.medEffect.match("Hat sich verschlimmert")) ?
              "Bad" : ""
          }]
          medEntry.addProperty("dosage", dosage);
        }

        if (this.medEffect == null) {
          let dosage = [{
            resourceType: "Dosage",
            doseQuantity: {
              value: this.menge
            }
          }]
          medEntry.addProperty("dosage", dosage);
        }

        let bundle2 = new Bundle("transaction");
        bundle2.addEntry("POST", medEntry.resourceType, medEntry);
        this.midataService.save(bundle2);
      }
      //========================= END JSON PUT MEDICATION COMPONENTS IN BUNDLE2 AND SAVE===========================================

      //update the input fields 
      this.situation = null;
      this.symptome = null;
      this.fromDateTime = null;
      this.untilDateTime = null;
      this.medicament = null;
      this.menge = 1;
      this.medEffect = null;
      this.selectedHeadache = false;
      this.selectedOther = false;
      this.selectedOther3 = false;
      this.selectedOther4 = false;
      this.selectedWateryEye = false;
      this.selectedRedEye = false;
      this.selectedNasenLaufen = false;
      this.selectedNasenVerstopfung = false;
      this.selectedFlimmerSehen = false;
      this.selectedPhotophobia = false;
      this.selectedPhonophobia = false;
      this.selectedTouchSensation = false;
      this.selectedSpeechDisorder = false;
      this.selectedSmellSensitivity = false;
      this.selectedVomiting = false;
      this.selectedNausea = false;
      this.intensity = 5; 
      this.intensityFlimmerSehen = 5; 
      this.intensityNasenLaufen = 5; 
      this.intensityNasenVerstopfung = 5; 
      this.intensityNausea = 5; 
      this.intensityPhonophobia = 5; 
      this.intensityPhotophobia = 5; 
      this.intensityRedEye = 5; 
      this.intensitySmellSensitivity = 5; 
      this.intensitySpeechDisorder = 5; 
      this.intensityTouchSensation = 5; 
      this.intensityVomiting = 5; 
      this.intensityWateryEye = 5; 
      this.intensityTouchSensation = 5; 
      this.fromDateTime = new Date(new Date().getTime() - 14400000).toISOString();
      this.untilDateTime = new Date(new Date().getTime() - 3600000).toISOString();
      this.selectedCard = false;
      this.selectedCard2 = false;
      this.selectedCard3 = false;

    } else {

      let alert2 = this.alertCtrl.create({
        message: 'Bitte melde dich in MIDATA an'
      });
      alert2.setTitle('Anmeldung erforderlich');

      alert2.addButton('Abbrechen');
      alert2.addButton({
        text: 'Bestätigen',
        handler: data => {
          console.log('Checkbox data:', data);
          this.navCtrl.push(LoginPage)
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
  //-------------------------------- END PERSISTENCE IN MIDATA OF ALL THE INPUT FIELDS---------------------------------------------------------

  swipe(event) {
    if (event.direction === 4) { // 4 = nach links swipen
      this.navCtrl.parent.select(1); // 0 = Home, 1 = Mein Tag, 2 = Neuer Eintrag
      //track event 
      this.matomoTracker.trackEvent("Page: Neuer Eintrag", "Slide to Mein Tag View")
    }
  }
}
