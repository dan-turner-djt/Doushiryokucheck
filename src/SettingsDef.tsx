/* Type definitions */

import { AuxFormData, VerbFormData } from "./Verb/VerbFormDefs";

export enum TestType {
  Amount, Endless, Timed
}

export type AmountSettingsObject = {
  amount: number
}

export type EndlessSettingsObject = object

export type TimedSettingsObject = {
  time: number
}

export type SettingsObject = {
  testType: TestType,
  testTypeObject: AmountSettingsObject | EndlessSettingsObject | TimedSettingsObject,
	verbType: {
		vtIchidan: boolean,
		vtIrregular: boolean,
		vtBu: boolean,
		vtGu: boolean,
		vtKu: boolean,
		vtMu: boolean,
		vtNu: boolean,
		vtRu: boolean,
		vtSu: boolean,
		vtTsu: boolean,
		vtU: boolean,

	},
	verbLevel: {
		vlN5: boolean,
		vlN4: boolean,
		vlN3: boolean,
		vlN2: boolean,
		vlN1: boolean
	},
	verbForms: VerbFormData,
	auxForms: AuxFormData,
	exclusiveAux: boolean
}


/* Default settings definitions */

export const DefaultAmountSettings: AmountSettingsObject = {
	amount: 20
};

export const DefaultEndlessSettings: EndlessSettingsObject = {
};

export const DefaultTimedSettings: TimedSettingsObject = {
	time: 60
};

export const DefaultSettings: SettingsObject = {
	testType: TestType.Amount,
	testTypeObject: DefaultAmountSettings,
	verbType: {
		vtIchidan: true,
		vtIrregular: true,
		vtBu: true,
		vtGu: true,
		vtKu: true,
		vtMu: true,
		vtNu: true,
		vtRu: true,
		vtSu: true,
		vtTsu: true,
		vtU: true,
	},
	verbLevel: {
		vlN5: true,
		vlN4: false,
		vlN3: false,
		vlN2: false,
		vlN1: false
	},
	verbForms: {
		stem: {
			plain: false
		},
		present: {
			plain: true, polite: true, negativePlain: true, negativePolite: true
		},
		past: {
			plain: true, polite: true, negativePlain: true, negativePolite: true
		},
		te: {
			plain: true, polite: false, negativePlain: true, negativePolite: false
		},
		tai: {
			plain: false, polite: false, negativePlain: false, negativePolite: false
		},
		zu: {
			plain: false
		},
		volitional: {
			plain: false, polite: false, negativePlain: false
		},
		imperative: {
			plain: false, polite: false, negativePlain: false
		},
		baConditional: {
			plain: false, polite: false, negativePlain: false
		},
		taraConditional: {
			plain: false, polite: false, negativePlain: false, negativePolite: false
		}
	},
	auxForms: {
		potential: {
			standard: false
		},
		passive: {
			standard: false
		},
		causative: {
			standard: false
		},
		causativePassive: {
			standard: false
		},
		chau: {
			standard: false
		}
	},
	exclusiveAux: false
};

/* Getter utils */

export const getTestTypeName = (testType: TestType):string => {
	switch (testType) {
	case TestType.Endless: {
		return "Unlimited Amount Test";
	}
	case TestType.Timed: {
		return "Timed Test";
	}
	default: {
		return "Set Amount Test";
	}
	}
};

export const getTestTypeDefaultSettings = (testType: TestType):AmountSettingsObject|EndlessSettingsObject|TimedSettingsObject => {
	switch (testType) {
	case TestType.Endless: {
		return DefaultEndlessSettings;
	}
	case TestType.Timed: {
		return DefaultTimedSettings;
	}
	default: {
		return DefaultAmountSettings;
	}
	}
};

