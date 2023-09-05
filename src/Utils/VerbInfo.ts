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