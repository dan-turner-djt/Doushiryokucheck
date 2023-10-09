import { FormInfo, VerbInfo } from "jv-conjugator";
import { AuxFormDisplayNames, VerbFormSubTypeDisplayNames, convertToAuxDisplayName, convertToDisplayName } from "../Verb/VerbFormDefs";

export type VerbFormsInfo = {main: FormInfo[], extraAux: FormInfo[]};
export type FullFormInfo = {displayName: string, auxDisplayName?: string, info: FormInfo};

export function convertToFullFormInfo(formInfo: FormInfo): FullFormInfo {
	const displayName: string = convertToDisplayName(formInfo.formName);
	let auxDisplayName = "";
	if (formInfo.auxFormName) {
		auxDisplayName = convertToAuxDisplayName(formInfo.auxFormName);
	}
	if (formInfo.additionalFormName) {
		auxDisplayName = AuxFormDisplayNames.chau;
	}

	return {displayName: displayName, auxDisplayName: auxDisplayName, info: formInfo};
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