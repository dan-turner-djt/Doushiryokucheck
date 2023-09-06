import { VerbInfo } from "jv-conjugator";
import { ErrorCode } from "../ErrorCodes";
import { SettingsObject } from "../SettingsDef";
import { FullVerbListInfo } from "../Verb/VerbInfoDefs";

export function getVerbLevelsArray(settingsObj: SettingsObject): string[] {
	const verbLevels: string[] = [];
	const verbLevelsObj = settingsObj.verbLevel;

	if (verbLevelsObj.vlN5) {
		verbLevels.push("N5");
	}
	if (verbLevelsObj.vlN4) {
		verbLevels.push("N4");
	}
	if (verbLevelsObj.vlN3) {
		verbLevels.push("N3");
	}
	if (verbLevelsObj.vlN2) {
		verbLevels.push("N2");
	}
	if (verbLevelsObj.vlN1) {
		verbLevels.push("N1");
	}

	return verbLevels;
}

export async function getFullVerbList(settings: SettingsObject): Promise<FullVerbListInfo> {

	try {
		const res = await fetchFromFile(5, "irregular")
			.then(res => {
				const toReturn: FullVerbListInfo = {N5: res};
				//console.log(toReturn);
				return toReturn;
			});
		return res;
	} 
	catch (e) {
		throw new Error(ErrorCode.FetchVerbListFailed);
	}
}

async function fetchFromFile(level: number, type: string): Promise<VerbInfo[]> {
	const request: RequestInfo = new Request("./verbData/n" + level + "/n" + level + "_"  + type + ".json");

	try {
		return fetch(request)
			.then(res => {
				//console.log(res);
				return res.json();
			})
			.then((res) => {
				//console.log(res.data);
				return res.data;
			})
			.catch(err => {
				console.log(err);
			});
	}
	catch (e) {
		throw new Error;
	}
	
}