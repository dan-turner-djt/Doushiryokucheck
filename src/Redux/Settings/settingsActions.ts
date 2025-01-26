import { SettingsObject } from "../../SettingsDef";
import { SET_SETTINGS } from "./settingsActionTypes";

export const setSettings = (settings: SettingsObject) => {
	return {
		type: SET_SETTINGS,
		payload: settings
	};
};