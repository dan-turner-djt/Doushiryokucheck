import { DefaultSettings, SettingsObject } from "../../SettingsDef";
import { SET_SETTINGS } from "./settingsActionTypes";

export type SettingsState = {
	currentSettings: SettingsObject,
	userId: number
}

const initialState: SettingsState = {
	currentSettings: DefaultSettings,
	userId: Math.floor(Math.random() * 1000000000000000)
};

const settingsReducer = (state = initialState, action: { type: string; payload: SettingsObject; }) => {
	switch(action.type) {
	case SET_SETTINGS:
		return {
			...state,
			currentSettings: action.payload
		};
	default:
		return state;
	}
};

export default settingsReducer;

