import { FormInfo, FormName, VerbInfo } from "jv-conjugator";
import { FormNames, VerbFormData, VerbFormDisplayNames, VerbFormSubTypeDisplayNames, WithNegativeForms, WithNegativePoliteForms, WithPlainForms, WithPoliteForms } from "../Verb/VerbFormDefs";

export type VerbFormsInfo = {displayName: string, info: FormInfo}[];

export function convertVerbFormsInfo(verbForms: VerbFormData): VerbFormsInfo {
	const newInfo: VerbFormsInfo = [];

	Object.keys(verbForms).forEach(key => {
		if (Object.keys(verbForms[key as keyof VerbFormData]).includes("plain")) {
			if ((verbForms[key as WithPlainForms]).plain === true) {
				newInfo.push({displayName: VerbFormDisplayNames[key as FormNames], info: {formName: getJvConjFormName(key)}});
			}
		}
		if (Object.keys(verbForms[key as keyof VerbFormData]).includes("polite")) {
			if ((verbForms[key as WithPoliteForms]).polite === true) {
				newInfo.push({displayName: VerbFormDisplayNames[key as FormNames], info: {formName: getJvConjFormName(key), polite: true}});
			}
		}
		if (Object.keys(verbForms[key as keyof VerbFormData]).includes("negativePlain")) {
			if ((verbForms[key as WithNegativeForms]).negativePlain === true) {
				newInfo.push({displayName: VerbFormDisplayNames[key as FormNames], info: {formName: getJvConjFormName(key), negative: true}});
			}
		}
		if (Object.keys(verbForms[key as keyof VerbFormData]).includes("negativePolite")) {
			if ((verbForms[key as WithNegativePoliteForms]).negativePolite === true) {
				newInfo.push({displayName: VerbFormDisplayNames[key as FormNames], info: {formName: getJvConjFormName(key), polite: true, negative: true}});
			}
		}
	});

	return newInfo;
}

export function getQuestionString(formInfo: {displayName: string, info: FormInfo} | undefined, verbInfo: VerbInfo | undefined): string {
	if (formInfo === undefined || verbInfo === undefined) return "";

	let res = "";

	if (verbInfo.verb.kanji) {
		res += verbInfo.verb.kanji + " (" + verbInfo.verb.kana + ")";
	} else {
		res += verbInfo.verb.kana;
	}
	
	res += " " + formInfo.displayName;
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