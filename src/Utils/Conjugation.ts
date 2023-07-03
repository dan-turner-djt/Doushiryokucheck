import { IrregularVerbs, VerbInfo, VerbType, checkVerbIsIrregular } from "./VerbDefs";
import { FormName } from "./VerbFormDefs";

export enum JLPTLevels {
  N5, N4, N3, N2, N1
}

export enum PoliteForms {
  Masu, Masen, Mashita, Masendeshita, Mashite, Masende, Mashou
}

export enum NegativeForms {
  Nai, Nakute, Nakatta, Naide, Nakereba, Nakattara, Zu
}

export type ProcessedVerbInfo = {verb: string, type: VerbType, irregular: false | IrregularVerbs};

export const getConjugation = (verbInfo: ProcessedVerbInfo, form: FormName): string => {
  /*if (checkVerbIsIrregular(verbInfo.verb)) {
    const res = getIrregularConjugation(verbInfo.verb, form)
    if (res !== false) return res;
  }*/

  switch (form) {
    case FormName.Stem:
      return getStem(verbInfo);
    case FormName.Present:
      return getPresent(verbInfo);
    case FormName.PresentPol:
      return getPresentPol(verbInfo);
    case FormName.Negative:
      return getNegative(verbInfo);
    case FormName.NegPol:
      return getNegPol(verbInfo);
    case FormName.Past:
      return getPast(verbInfo);
    case FormName.PastPol:
      return getPastPol(verbInfo);
    case FormName.NegPast:
      return getNegPast(verbInfo);
    case FormName.NegPastPol:
      return getNegPastPol(verbInfo);
    case FormName.Te:
      return getTe(verbInfo);
    case FormName.TeReq:
      return getTeReq(verbInfo);
    case FormName.NegTe:
      return getNegTe(verbInfo);
    case FormName.NegReq:
      return getNegReq(verbInfo);
    case FormName.Naide:
      return getNaide(verbInfo);
    case FormName.Zu:
      return getZu(verbInfo);
    case FormName.PotentialFull:
      return getPotentialFull(verbInfo);
    case FormName.PotentialShort:
      return getPotentialShort(verbInfo);
    case FormName.NegPotentialFull:
      return getNegPotentialFull(verbInfo);
    case FormName.NegPotentialShort:
      return getNegPotentialShort(verbInfo);
    case FormName.Passive:
      return getPassive(verbInfo);
    case FormName.NegPassive:
      return getNegPassive(verbInfo);
    case FormName.Causative:
      return getCausative(verbInfo);
    case FormName.NegCausative:
      return getNegCausative(verbInfo);
    case FormName.CausPassive:
      return getCausPassive(verbInfo);
    case FormName.NegCausPassive:
      return getNegCausPassive(verbInfo);
    case FormName.Imperative:
      return getImperative(verbInfo);
    case FormName.NegImperative:
      return getNegImperative(verbInfo);
    case FormName.Nasai:
      return getNasai(verbInfo);
    case FormName.Volitional:
      return getVolitional(verbInfo);
    case FormName.VolitionalPol:
      return getVolitionalPol(verbInfo);
    case FormName.BaConditional:
      return getEbaConditional(verbInfo);
    case FormName.NegBaConditional:
      return getNegEbaConditional(verbInfo);
    case FormName.TaraConditional:
      return getTaraConditional(verbInfo);
    case FormName.NegTaraConditional:
      return getNegTaraConditional(verbInfo);
    default:
      console.log("Unknown form");
      return verbInfo.verb;
  }
}


/* Base conjugation getters */

const getStem = (verbInfo: ProcessedVerbInfo): string => {
  return getStems(verbInfo, 1);
}

const getPresent = (verbInfo: ProcessedVerbInfo): string => {
  return verbInfo.verb;
}

const getPresentPol = (verbInfo: ProcessedVerbInfo): string => {
  return getPoliteForm(verbInfo, PoliteForms.Masu);
}

const getNegative = (verbInfo: ProcessedVerbInfo): string => {
  return getNegativeForm(verbInfo, NegativeForms.Nai);
}

const getNegPol = (verbInfo: ProcessedVerbInfo): string => {
  return getPoliteForm(verbInfo, PoliteForms.Masen);
}

const getPast = (verbInfo: ProcessedVerbInfo): string => {
  return getTaForm(verbInfo);
}

const getPastPol = (verbInfo: ProcessedVerbInfo): string => {
  return getPoliteForm(verbInfo, PoliteForms.Mashita);
}

const getNegPast = (verbInfo: ProcessedVerbInfo): string => {
  return getNegativeForm(verbInfo, NegativeForms.Nakatta);
}

const getNegPastPol = (verbInfo: ProcessedVerbInfo): string => {
  return getPoliteForm(verbInfo, PoliteForms.Masendeshita);
}

const getTe = (verbInfo: ProcessedVerbInfo): string => {
  return getTeForm(verbInfo);
}

const getTeReq = (verbInfo: ProcessedVerbInfo): string => {
  return getTeForm(verbInfo) + kudasai;
}

const getNegTe = (verbInfo: ProcessedVerbInfo): string => {
  return getNegativeForm(verbInfo, NegativeForms.Nakute);
}

const getNegReq = (verbInfo: ProcessedVerbInfo): string => {
  return getNaide(verbInfo) + kudasai;
}

const getNaide = (verbInfo: ProcessedVerbInfo): string => {
  return getNegativeForm(verbInfo, NegativeForms.Naide);
}

const getZu = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Aru) {
      return "あらず";
    }
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return "せず";
    }
  }
  
  return getNegativeForm(verbInfo, NegativeForms.Zu);
}

const getPotentialFull = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular === IrregularVerbs.Suru) {
    return "できる";
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 2) + "る";
  }
  return getRaw(verbInfo) + "られる";
}

const getPotentialShort = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular === IrregularVerbs.Suru) {
    return "できる";
  }

  if (verbInfo.type === VerbType.Godan) {
    return getPotentialFull(verbInfo);
  } 
  return getRaw(verbInfo) + "れる";
}

const getNegPotentialFull = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular === IrregularVerbs.Suru) {
    return "できない";
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 2) + "ない";
  } 
  return getRaw(verbInfo) + "られない";
}

const getNegPotentialShort = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular === IrregularVerbs.Suru) {
    return "できない";
  }

  if (verbInfo.type === VerbType.Godan) {
    return getPotentialFull(verbInfo);
  } 
  return getRaw(verbInfo) + "れない";
}

const getPassive = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "れる"
  } 
  return getRaw(verbInfo) + "られる";
}

const getNegPassive = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "れない"
  } 
  return getRaw(verbInfo) + "られない";
}

const getCausative = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "せる"
  } 
  return getRaw(verbInfo) + "させる";
}

const getNegCausative = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "せない"
  } 
  return getRaw(verbInfo) + "させない";
}

const getCausPassive = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "せられる"
  } 
  return getRaw(verbInfo) + "させられる";
}

const getNegCausPassive = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "せられない"
  } 
  return getRaw(verbInfo) + "させられない";
}

const getImperative = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular === IrregularVerbs.Kureru) {
    return getRaw(verbInfo);
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0);
  }
  return getRaw(verbInfo) + "ろ";
}

const getNegImperative = (verbInfo: ProcessedVerbInfo): string => {
  return verbInfo.verb + "な";
}

const getNasai = (verbInfo: ProcessedVerbInfo): string => {
  return getStems(verbInfo, 1) + "なさい";
}

const getVolitional = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 3) + "う";
  }
  return getRaw(verbInfo) + "よう";
}

const getVolitionalPol = (verbInfo: ProcessedVerbInfo): string => {
  return getPoliteForm(verbInfo, PoliteForms.Mashou);
}

const getEbaConditional = (verbInfo: ProcessedVerbInfo): string => {
  return getStems(verbInfo, 2) + "ば";
}

const getNegEbaConditional = (verbInfo: ProcessedVerbInfo): string => {
  return getNegativeForm(verbInfo, NegativeForms.Nakereba);
}

const getTaraConditional = (verbInfo: ProcessedVerbInfo): string => {
  return getTaForm(verbInfo) + "ら";
}

const getNegTaraConditional = (verbInfo: ProcessedVerbInfo): string => {
  return getNegativeForm(verbInfo, NegativeForms.Nakattara);
}


/* Conjugation helpers */

const getPoliteForm = (verbInfo: ProcessedVerbInfo, formType: PoliteForms): string => {
  const stem = getStems(verbInfo, 1);

  switch (formType) {
    case PoliteForms.Masu:
      return stem + "ます";
    case PoliteForms.Masen:
      return stem + "ません";
    case PoliteForms.Mashita:
      return stem + "ました";
    case PoliteForms.Masendeshita:
      return stem + "ませんでした";
    case PoliteForms.Mashite:
      return stem + "まして";
    case PoliteForms.Masende:
      return stem + "ませんで";
    case PoliteForms.Mashou:
      return stem + "ましょう";
    default:
      console.log("Unknown polite form");
      return stem;
  }
}

const getNegativeForm = (verbInfo: ProcessedVerbInfo, formType: NegativeForms): string => {
  const stem = getNegativeStem(verbInfo);

  switch (formType) {
    case NegativeForms.Nai:
      return stem + "い";
    case NegativeForms.Nakute:
      return stem + "くて";
    case NegativeForms.Nakatta:
      return stem + "かった";
    case NegativeForms.Naide:
      return stem + "いで";
    case NegativeForms.Nakereba:
      return stem + "ければ";
    case NegativeForms.Nakattara:
      return stem + "かったら";
    case NegativeForms.Zu:
      return stem + "ず";
    default:
      console.log("Unknown negative form");
      return stem;
  }
}

const getNegativeStem = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Aru) {
      return "な";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return "こな";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "な";
  }
  return getRaw(verbInfo) + "な";
}

const getStems = (verbInfo: ProcessedVerbInfo, stemIndex: number): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Irassharu
    || verbInfo.irregular === IrregularVerbs.Ossharu
    || verbInfo.irregular === IrregularVerbs.Kudasaru
    || verbInfo.irregular === IrregularVerbs.Gozaru
    || verbInfo.irregular === IrregularVerbs.Nasaru) {
      return getRaw(verbInfo) + "い";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getRaw(verbInfo) + stems[getEndingChar(verbInfo)][stemIndex];
  }
  return getRaw(verbInfo);
}

const getTeForm = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Iku) {
      return getRaw(verbInfo) + "って";
    }
    if (verbInfo.irregular === IrregularVerbs.Tou) {
      return getRaw(verbInfo) + "うて";
    }
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return "して";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return "きて";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    const endingChar = getEndingChar(verbInfo);
    return getRaw(verbInfo) + tStems[endingChar] + teEndings[endingChar];
  }
  return getRaw(verbInfo) + "て";
}

const getTaForm = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Iku) {
      return getRaw(verbInfo) + "った";
    }
    if (verbInfo.irregular === IrregularVerbs.Tou) {
      return getRaw(verbInfo) + "うた";
    }
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return "した";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return "きた";
    }
  }
  
  if (verbInfo.type === VerbType.Godan) {
    const endingChar = getEndingChar(verbInfo);
      return getRaw(verbInfo) + tStems[endingChar] + taEndings[endingChar];
  }
  return getRaw(verbInfo) + "た";
}

const getRaw = (verbInfo: ProcessedVerbInfo): string => {
  return verbInfo.verb.slice(0, -1);
}

const getEndingChar = (verbInfo: ProcessedVerbInfo): string => {
  return verbInfo.verb.slice(-1);
}


/* Definitions */

const kudasai: string = "ください";

const stems: { [index: string]: string[] } = {
  う: ["わ", "い", "え", "お"],
  く: ["か", "き", "け", "こ"],
  ぐ: ["が", "ぎ", "げ", "ご"],
  す: ["さ", "し", "せ", "そ"],
  つ: ["た", "ち", "て", "と"],
  ぬ: ["な", "に", "ね", "の"],
  ぶ: ["ば", "び", "べ", "ぼ"],
  む: ["ま", "み", "め", "も"],
  る: ["ら", "り", "れ", "ろ"]
}

const tStems: { [index: string]: string } = {
  う: "っ", く: "い", ぐ: "い", す: "し", つ: "っ", ぬ: "ん", ぶ: "ん", む: "ん", る: "っ"
}

const teEndings: { [index: string]: string } = {
  う: "て", く: "て", ぐ: "で", す: "て", つ: "て", ぬ: "で", ぶ: "で", む: "で", る: "て"
}

const taEndings: { [index: string]: string } = {
  う: "た", く: "た", ぐ: "だ", す: "た", つ: "た", ぬ: "だ", ぶ: "だ", む: "だ", る: "た"
}