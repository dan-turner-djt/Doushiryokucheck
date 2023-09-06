import { FormInfo, Result, VerbInfo, getVerbConjugation } from "jv-conjugator";

export function getConjugation(verbInfo: VerbInfo, formInfo: FormInfo): {kana: string, kanji?: string} {

	const res: Result | Error = getVerbConjugation(verbInfo, formInfo);
	if (res instanceof Error || !res.kana) throw new Error;

	return {kana: res.kana, kanji: res.kanji};
}