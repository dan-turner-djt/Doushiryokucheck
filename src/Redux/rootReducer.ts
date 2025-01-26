import { combineReducers } from "@reduxjs/toolkit";
import settingsReducer from "./Settings/settingsReducer";
import testReducer from "./Test/testReducer";

const rootReducer = combineReducers({settings: settingsReducer, test: testReducer});

export default rootReducer;