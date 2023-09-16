import { FormInfo, Result, VerbInfo, getVerbConjugation } from "jv-conjugator";
import { ErrorCode } from "../ErrorCodes";

export function getAnswers(verbInfo: VerbInfo, formInfo: FormInfo): {kana: string, kanji?: string}[] {
	const answers: {kana: string, kanji?: string}[] = [];

	answers.push(getConjugation(verbInfo, formInfo));
	
	return answers;
}

function getConjugation(verbInfo: VerbInfo, formInfo: FormInfo): {kana: string, kanji?: string} {
	const res: Result | Error = getVerbConjugation(verbInfo, formInfo);
	if (res instanceof Error) throw new Error(res.message);
	if (!res.kana) throw new Error(ErrorCode.ConjugationResultNoKana);

	return {kana: res.kana, kanji: res.kanji};
}