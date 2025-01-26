import { SET_TESTSTATE } from "./testActionTypes";


export const enum InTestState {
	True, False, Loading, Error
}

export type TestState = {
	testState: InTestState
}

const initialState: TestState = {
	testState: InTestState.False
};

const testReducer = (state = initialState, action: { type: string; payload: InTestState; }) => {
	switch(action.type) {
	case SET_TESTSTATE:
		return {
			...state,
			testState: action.payload
		};
	default:
		return state;
	}
};

export default testReducer;