export enum VerbFormNamesInfo {
  stem = "Stem",
  present = "Present",
  past = "Past",
  te = "て Form",
  naide = "ないで Form",
  tai = "たい Form",
  zu = "ず Form",
  volitional = "Volitional",
  imperative = "Imperative",
  baConditional = "えば Conditional",
  taraConditional = "たら Conditional"
}

export enum VerbFormSubTypeNamesInfo {
  plain = "Plain",
  polite = "Polite",
  negativePlain = "Negative Plain",
  negativePolite = "Negative Polite"
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
  naide: {
    plain: boolean, polite: boolean
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

export type WithPlainForms = "stem" | "present" | "past" | "te" | "naide" | "tai" | "zu" | "volitional" | "imperative" | "baConditional" | "taraConditional";
export type WithPoliteForms = "present" | "past" | "te" | "naide" | "tai" | "volitional" | "imperative" | "baConditional" | "taraConditional";
export type WithNegativeForms = "present" | "past" | "te" | "tai" | "volitional" | "imperative" | "taraConditional";
export type WithNegativePoliteForms = "present" | "past" | "te" | "tai" | "taraConditional";
export type FormNames = WithPlainForms | WithPoliteForms | WithNegativeForms | WithNegativePoliteForms;