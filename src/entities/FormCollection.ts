import { DateTime } from "ionic-angular";

export class FormCollection {
	id: number;
    situation: any;
    symptome: any;
    painAreal: any;
    painType: any;
    trigger: any;
    fromDateTime: DateTime;
    untilDateTime: DateTime;
    intensity: number = 0;
    medicament: String = "";
    menge: number = 0;
    medEffect: any;

	constructor(values: Object = {}) {
		Object.assign(this, values);
	}
}