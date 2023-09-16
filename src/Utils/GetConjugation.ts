import { AuxiliaryFormName, FormInfo, FormName, Result, VerbInfo, getVerbConjugation } from "jv-conjugator";
import { ErrorCode } from "../ErrorCodes";

export function getAnswers(verbInfo: VerbInfo, formInfo: FormInfo): {kana: string, kanji?: string}[] {
	const answers: {kana: string, kanji?: string}[] = [];

	answers.push(getConjugation(verbInfo, formInfo));

	// Add the shortVer answer as well if there is one
	if(formInfo.formName === FormName.BaConditional && formInfo.polite
		|| formInfo.auxFormName === AuxiliaryFormName.Potential
		|| formInfo.auxFormName === AuxiliaryFormName.Causative
		|| formInfo.auxFormName === AuxiliaryFormName.CausativePassive) {

		const newFormInfo: FormInfo = JSON.parse(JSON.stringify(formInfo));
		newFormInfo.shortVer = true;

		const res = getConjugation(verbInfo, newFormInfo);
		if (!(res instanceof Error)) {
			answers.push(res);
		}
	}

	console.log(answers);
	
	return answers;
}

function getConjugation(verbInfo: VerbInfo, formInfo: FormInfo): {kana: string, kanji?: string} {
	const res: Result | Error = getVerbConjugation(verbInfo, formInfo);
	if (res instanceof Error) throw new Error(res.message);
	if (!res.kana) throw new Error(ErrorCode.ConjugationResultNoKana);

	return {kana: res.kana, kanji: res.kanji};
}