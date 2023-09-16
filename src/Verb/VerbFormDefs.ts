export enum VerbFormDisplayNames {
  stem = "Stem",
  present = "Present",
  past = "Past",
  te = "て Form",
  tai = "たい Form",
  zu = "ず Form",
  volitional = "Volitional",
  imperative = "Imperative",
  baConditional = "えば Conditional",
  taraConditional = "たら Conditional"
}

export enum VerbFormSubTypeDisplayNames {
  plain = "Plain",
  polite = "Polite",
  negative = "Negative",
}

export enum AuxFormDisplayNames {
  potential = "Potential",
  passive = "Passive",
  causative = "Causative",
  causativePassive = "Causative Passive",
  chau = "ちゃう Form"
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
    plain: boolean, polite: boolean
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