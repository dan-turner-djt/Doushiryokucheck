import { VerbInfo } from "jv-conjugator";
import { ErrorCode } from "../ErrorCodes";
import { SettingsObject } from "../SettingsDef";

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

export async function getFullVerbList(settings: SettingsObject): Promise<VerbInfo[]> {

	const settingsList: {level: number, type: string}[] = convertSettingsIntoList(settings);

	try {
		let fullList: VerbInfo[] = [];
		for (const setting of settingsList) {
			if (setting.type === "godan") {
				const godanTypes: string[] = [];
				if (settings.verbType.vtBu) {
					godanTypes.push("bu");
				}
				if (settings.verbType.vtGu) {
					godanTypes.push("gu");
				}
				if (settings.verbType.vtKu) {
					godanTypes.push("ku");
				}
				if (settings.verbType.vtMu) {
					godanTypes.push("mu");
				}
				if (settings.verbType.vtNu) {
					godanTypes.push("nu");
				}
				if (settings.verbType.vtRu) {
					godanTypes.push("ru");
				}
				if (settings.verbType.vtSu) {
					godanTypes.push("su");
				}
				if (settings.verbType.vtTsu) {
					godanTypes.push("tsu");
				}
				if (settings.verbType.vtU) {
					godanTypes.push("u");
				}

				const res = await fetchFromFile(setting.level, setting.type, godanTypes);
				fullList = fullList.concat(res);
			} else {
				const res = await fetchFromFile(setting.level, setting.type);
				fullList = fullList.concat(res);
			}
		}
		
		return fullList;
	} 
	catch (e) {
		throw new Error(ErrorCode.FetchVerbListFailed);
	}
}

async function fetchFromFile(level: number, type: string, godanTypes: string[] = []): Promise<VerbInfo[]> {
	const request: RequestInfo = new Request("./verbData/n" + level + "/n" + level + "_"  + type + ".json");

	try {
		return fetch(request)
			.then(res => {
				return res.json();
			})
			.then((res) => {
				if (type === "godan") {
					if (godanTypes.length === 0) {
						throw new Error;
					}

					let toReturn: VerbInfo[] = [];
					Object.keys(res.data).forEach(type => {
						if (godanTypes.includes(type)) {
							toReturn = toReturn.concat(res.data[type]);
						}
					});

					return toReturn;
				}

				return res.data;
			})
			.catch(err => {
				throw new Error;
			});
	}
	catch (e) {
		throw new Error;
	}	
}

function convertSettingsIntoList(settings: SettingsObject): {level: number, type: string}[] {
	type levelType = "vlN5" | "vlN4" | "vlN3" | "vlN2" | "vlN1";

	const levelsList: number[] = [];
	Object.keys(settings.verbLevel).forEach((l) => {
		if(settings.verbLevel[l as levelType] === true) {
			levelsList.push(Number(l.substring(l.length - 1)));
		}
	});
	
	const settingsList: {level: number, type: string}[] = [];
	levelsList.forEach(l => {
		if (settings.verbType.vtIchidan) {
			settingsList.push({level: l, type: "ichidan"});
		}
		if (settings.verbType.vtIrregular) {
			settingsList.push({level: l, type: "irregular"});
		}
		
		if (settings.verbType.vtBu || settings.verbType.vtGu || settings.verbType.vtKu || settings.verbType.vtMu || settings.verbType.vtNu 
			|| settings.verbType.vtRu || settings.verbType.vtSu || settings.verbType.vtTsu || settings.verbType.vtU) {
			settingsList.push({level: l, type: "godan"});
		}
	});

	return settingsList;
}