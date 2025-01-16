import { AuxiliaryFormName, FormName } from "jv-conjugator";

export enum VerbFormDisplayNames {
  stem = "Stem",
  present = "Present",
  past = "Past",
  te = "て Form",
  imperative = "Imperative",
  volitional = "Volitional",
  baConditional = "えば Conditional",
  taraConditional = "たら Conditional",
  naide = "ないで Form",
  zu = "ず Form",
  tai = "たい Form"
}

export enum AuxFormDisplayNames {
  potential = "Potential",
  passive = "Passive",
  causative = "Causative",
  causativePassive = "Causative Passive",
  chau = "ちゃう Form"
}

export function convertToDisplayName(formName: FormName): string {
	switch (formName) {
	case FormName.Stem:
		return VerbFormDisplayNames.stem;
	case FormName.Present:
		return VerbFormDisplayNames.present;
	case FormName.Past:
		return VerbFormDisplayNames.past;
	case FormName.Te:
		return VerbFormDisplayNames.te;
	case FormName.Imperative:
		return VerbFormDisplayNames.imperative;
	case FormName.Volitional:
		return VerbFormDisplayNames.volitional;
	case FormName.BaConditional:
		return VerbFormDisplayNames.baConditional;
	case FormName.TaraConditional:
		return VerbFormDisplayNames.taraConditional;
	case FormName.Naide:
		return VerbFormDisplayNames.naide;
	case FormName.Zu:
		return VerbFormDisplayNames.zu;
	case FormName.Tai:
		return VerbFormDisplayNames.tai;
	default:
		return VerbFormDisplayNames.stem;
	}
}

export function convertToAuxDisplayName(formName: AuxiliaryFormName): string {
	switch (formName) {
	case AuxiliaryFormName.Potential:
		return AuxFormDisplayNames.potential;
	case AuxiliaryFormName.Passive:
		return AuxFormDisplayNames.passive;
	case AuxiliaryFormName.Causative:
		return AuxFormDisplayNames.causative;
	case AuxiliaryFormName.CausativePassive:
		return AuxFormDisplayNames.causativePassive;
	default:
		return AuxFormDisplayNames.potential;
	}
}

export enum VerbFormSubTypeDisplayNames {
  plain = "Plain",
  polite = "Polite",
  negative = "Negative",
}

export type VerbFormData = {
  stem: {
    plain: boolean
  },
  present: {
    plain: boolean, polite: boolean, negativePlain: boolean, negativePolite: boolean
  },
  past: {
    plain: boolean, polite: boolean, negativePlain: boolean, negativePolite: boolean
  },
  te: {
    plain: boolean, polite: boolean, negativePlain: boolean, negativePolite: boolean
  },
  tai: {
    plain: boolean, polite: boolean, negativePlain: boolean, negativePolite: boolean
  }
  zu: {
    plain: boolean
  },
  volitional: {
    plain: boolean, polite: boolean, negativePlain: boolean
  },
  imperative: {
    plain: boolean, polite: boolean, negativePlain: boolean
  },
  baConditional: {
    plain: boolean, polite: boolean, negativePlain: boolean, negativePolite: boolean
  },
  taraConditional: {
    plain: boolean, polite: boolean, negativePlain: boolean, negativePolite: boolean
  }
}

export type AuxFormData = {
  potential: {
    standard: boolean
  },
  passive: {
    standard: boolean
  },
  causative: {
    standard: boolean
  },
  causativePassive: {
    standard: boolean
  }
  chau: {
    standard: boolean
  }
}

export type WithPlainForms = "stem" | "present" | "past" | "te" | "tai" | "zu" | "volitional" | "imperative" | "baConditional" | "taraConditional";
export type WithPoliteForms = "present" | "past" | "te" | "tai" | "volitional" | "imperative" | "baConditional" | "taraConditional";
export type WithNegativeForms = "present" | "past" | "te" | "tai" | "volitional" | "imperative" | "taraConditional";
export type WithNegativePoliteForms = "present" | "past" | "te" | "tai" | "taraConditional";
export type FormNames = WithPlainForms | WithPoliteForms | WithNegativeForms | WithNegativePoliteForms;


export type AuxFormNames = "potential" | "passive" | "causative" | "causativePassive" | "chau";