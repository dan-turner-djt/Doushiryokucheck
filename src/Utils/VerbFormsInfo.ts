import { AuxiliaryFormName, FormInfo, FormName, VerbInfo } from "jv-conjugator";
import { AuxFormData, AuxFormDisplayNames, AuxFormNames, FormNames, VerbFormData, VerbFormDisplayNames, VerbFormSubTypeDisplayNames, WithNegativeForms, WithNegativePoliteForms, WithPlainForms, WithPoliteForms } from "../Verb/VerbFormDefs";

export type VerbFormsInfo = {displayName: string, auxDisplayName?: string, info: FormInfo}[];

export function convertVerbFormsInfo(verbForms: VerbFormData, auxForms: AuxFormData, exclusiveAux: boolean): VerbFormsInfo {
	const newInfo: VerbFormsInfo = [];

	const auxFormsList: string[] = [];
	Object.keys(auxForms).forEach(auxKey => {
		if(auxForms[auxKey as AuxFormNames].standard === true) {
			auxFormsList.push(auxKey);
		}
	});

	Object.keys(verbForms).forEach(key => {
		if (Object.keys(verbForms[key as keyof VerbFormData]).includes("plain")) {
			if ((verbForms[key as WithPlainForms]).plain === true) {
				if (auxFormsList.length > 0) {
					auxFormsList.forEach(auxForm => {
						newInfo.push({displayName: VerbFormDisplayNames[key as FormNames],
							auxDisplayName: AuxFormDisplayNames[auxForm as AuxFormNames],
							info: {formName: getJvConjFormName(key), auxFormName: getJvConjAuxFormName(auxForm)}});
					});

					if (exclusiveAux) {
						return;
					}
				}

				newInfo.push({displayName: VerbFormDisplayNames[key as FormNames], info: {formName: getJvConjFormName(key)}});
			}
		}
		if (Object.keys(verbForms[key as keyof VerbFormData]).includes("polite")) {
			if ((verbForms[key as WithPoliteForms]).polite === true) {
				if (auxFormsList.length > 0) {
					auxFormsList.forEach(auxForm => {
						newInfo.push({displayName: VerbFormDisplayNames[key as FormNames],
							auxDisplayName: AuxFormDisplayNames[auxForm as AuxFormNames],
							info: {formName: getJvConjFormName(key), auxFormName: getJvConjAuxFormName(auxForm), polite: true}});
					});

					if (exclusiveAux) {
						return;
					}
				}

				newInfo.push({displayName: VerbFormDisplayNames[key as FormNames], info: {formName: getJvConjFormName(key), polite: true}});
			}
		}
		if (Object.keys(verbForms[key as keyof VerbFormData]).includes("negativePlain")) {
			if ((verbForms[key as WithNegativeForms]).negativePlain === true) {
				if (auxFormsList.length > 0) {
					auxFormsList.forEach(auxForm => {
						newInfo.push({displayName: VerbFormDisplayNames[key as FormNames],
							auxDisplayName: AuxFormDisplayNames[auxForm as AuxFormNames],
							info: {formName: getJvConjFormName(key), auxFormName: getJvConjAuxFormName(auxForm), negative: true}});
					});

					if (exclusiveAux) {
						return;
					}
				}

				newInfo.push({displayName: VerbFormDisplayNames[key as FormNames], info: {formName: getJvConjFormName(key), negative: true}});
			}
		}
		if (Object.keys(verbForms[key as keyof VerbFormData]).includes("negativePolite")) {
			if ((verbForms[key as WithNegativePoliteForms]).negativePolite === true) {
				if (auxFormsList.length > 0) {
					auxFormsList.forEach(auxForm => {
						newInfo.push({displayName: VerbFormDisplayNames[key as FormNames],
							auxDisplayName: AuxFormDisplayNames[auxForm as AuxFormNames],
							info: {formName: getJvConjFormName(key), auxFormName: getJvConjAuxFormName(auxForm), polite: true, negative: true}});
					});

					if (exclusiveAux) {
						return;
					}
				}
				
				newInfo.push({displayName: VerbFormDisplayNames[key as FormNames], info: {formName: getJvConjFormName(key), polite: true, negative: true}});
			}
		}
	});

	console.log("here!");
	console.log(newInfo);

	return newInfo;
}

export function getQuestionStringVerb(verbInfo: VerbInfo | undefined): string {
	if (verbInfo === undefined) return "";

	let res = "";

	if (verbInfo.verb.kanji) {
		res += verbInfo.verb.kanji + " / ";
	}
	res += verbInfo.verb.kana;

	return res;
}

export function getQuestionStringForm(formInfo: {displayName: string, auxDisplayName?: string, info: FormInfo} | undefined): string {
	if (formInfo === undefined) return "";

	let res = "";

	if (formInfo.auxDisplayName !== undefined) {
		res += formInfo.auxDisplayName + " ";
	}
	
	res += formInfo.displayName;

	if (formInfo.info.negative) {
		res += (" " + VerbFormSubTypeDisplayNames.negative);
	}

	if (formInfo.info.polite) {
		res += (" " + VerbFormSubTypeDisplayNames.polite);
	} else {
		res += (" (" + VerbFormSubTypeDisplayNames.plain + ")");
	}

	return res;
}

function getJvConjFormName(name: string): FormName {
	switch(name) {
	case "stem":
		return FormName.Stem;
	case "present":
		return FormName.Present;
	case "past":
		return FormName.Past;
	case "te":
		return FormName.Te;
	case "naide":
		return FormName.Naide;
	case "tai":
		return FormName.Tai;
	case "zu":
		return FormName.Zu;
	case "volitional":
		return FormName.Volitional;
	case "imperative":
		return FormName.Imperative;
	case "baConditional":
		return FormName.BaConditional;
	case "taraConditional":
		return FormName.TaraConditional;
	default:
		return FormName.Present;
	}
}

function getJvConjAuxFormName(name: string): AuxiliaryFormName {
	switch(name) {
	case "potential":
		return AuxiliaryFormName.Potential;
	case "passive":
		return AuxiliaryFormName.Passive;
	case "causative":
		return AuxiliaryFormName.Causative;
	case "causativePassive":
		return AuxiliaryFormName.CausativePassive;
	case "tagaru":
		return AuxiliaryFormName.Tagaru;
	default:
		return AuxiliaryFormName.Potential;
	}
}