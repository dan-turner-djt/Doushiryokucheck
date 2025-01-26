import { SET_TESTSTATE } from "./testActionTypes";
import { InTestState } from "./testReducer";

export const setTestState = (testState: InTestState) => {
	return {
		type: SET_TESTSTATE,
		payload: testState
	};
};