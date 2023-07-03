import { IrregularVerbs, VerbType, dekiruKanjiStem, kuruStems, stems, suruStems, tStems, taEndings, teEndings } from "./VerbDefs";
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

export const getConjugation = (verbInfo: ProcessedVerbInfo, form: FormName, useKanji: boolean): string => {
  switch (form) {
    case FormName.Stem:
      return getStem(verbInfo, useKanji);
    case FormName.Present:
      return getPresent(verbInfo);
    case FormName.PresentPol:
      return getPresentPol(verbInfo, useKanji);
    case FormName.Negative:
      return getNegative(verbInfo, useKanji);
    case FormName.NegPol:
      return getNegPol(verbInfo, useKanji);
    case FormName.Past:
      return getPast(verbInfo, useKanji);
    case FormName.PastPol:
      return getPastPol(verbInfo, useKanji);
    case FormName.NegPast:
      return getNegPast(verbInfo, useKanji);
    case FormName.NegPastPol:
      return getNegPastPol(verbInfo, useKanji);
    case FormName.Te:
      return getTe(verbInfo, useKanji);
    case FormName.TeReq:
      return getTeReq(verbInfo, useKanji);
    case FormName.NegTe:
      return getNegTe(verbInfo, useKanji);
    case FormName.NegReq:
      return getNegReq(verbInfo, useKanji);
    case FormName.Naide:
      return getNaide(verbInfo, useKanji);
    case FormName.Zu:
      return getZu(verbInfo, useKanji);
    case FormName.PotentialFull:
      return getPotentialFull(verbInfo, useKanji);
    case FormName.PotentialShort:
      return getPotentialShort(verbInfo, useKanji);
    case FormName.NegPotentialFull:
      return getNegPotentialFull(verbInfo, useKanji);
    case FormName.NegPotentialShort:
      return getNegPotentialShort(verbInfo, useKanji);
    case FormName.Passive:
      return getPassive(verbInfo, useKanji);
    case FormName.NegPassive:
      return getNegPassive(verbInfo, useKanji);
    case FormName.Causative:
      return getCausative(verbInfo, useKanji);
    case FormName.NegCausative:
      return getNegCausative(verbInfo, useKanji);
    case FormName.CausPassive:
      return getCausPassive(verbInfo, useKanji);
    case FormName.NegCausPassive:
      return getNegCausPassive(verbInfo, useKanji);
    case FormName.Imperative:
      return getImperative(verbInfo, useKanji);
    case FormName.NegImperative:
      return getNegImperative(verbInfo);
    case FormName.Nasai:
      return getNasai(verbInfo, useKanji);
    case FormName.Volitional:
      return getVolitional(verbInfo, useKanji);
    case FormName.VolitionalPol:
      return getVolitionalPol(verbInfo, useKanji);
    case FormName.BaConditional:
      return getEbaConditional(verbInfo, useKanji);
    case FormName.NegBaConditional:
      return getNegEbaConditional(verbInfo, useKanji);
    case FormName.TaraConditional:
      return getTaraConditional(verbInfo, useKanji);
    case FormName.NegTaraConditional:
      return getNegTaraConditional(verbInfo, useKanji);
    default:
      console.log("Unknown form");
      return verbInfo.verb;
  }
}


/* Base conjugation getters */

const getStem = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getStems(verbInfo, useKanji, 1);
}

const getPresent = (verbInfo: ProcessedVerbInfo): string => {
  return verbInfo.verb;
}

const getPresentPol = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getPoliteForm(verbInfo, useKanji, PoliteForms.Masu);
}

const getNegative = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getNegativeForm(verbInfo, useKanji, NegativeForms.Nai);
}

const getNegPol = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getPoliteForm(verbInfo, useKanji, PoliteForms.Masen);
}

const getPast = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getTaForm(verbInfo, useKanji);
}

const getPastPol = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getPoliteForm(verbInfo, useKanji, PoliteForms.Mashita);
}

const getNegPast = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getNegativeForm(verbInfo, useKanji, NegativeForms.Nakatta);
}

const getNegPastPol = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getPoliteForm(verbInfo, useKanji, PoliteForms.Masendeshita);
}

const getTe = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getTeForm(verbInfo, useKanji);
}

const getTeReq = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getTeForm(verbInfo, useKanji) + (useKanji)? kudasaiKanji : kudasaiPlain;
}

const getNegTe = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getNegativeForm(verbInfo, useKanji, NegativeForms.Nakute);
}

const getNegReq = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getNaide(verbInfo, useKanji) + (useKanji)? kudasaiKanji : kudasaiPlain;
}

const getNaide = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getNegativeForm(verbInfo, useKanji, NegativeForms.Naide);
}

const getZu = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Aru) {
      if (useKanji) {
        return getRaw(verbInfo) + "らず";
      }
      return "あらず";
    }
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, useKanji, 2) + "ず";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "ず";
    }
  }
  
  return getNegativeForm(verbInfo, useKanji, NegativeForms.Zu);
}

const getPotentialFull = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      if (useKanji) {
        return dekiruKanjiStem + "る";
      }
      return "できる";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "られる";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, useKanji, 2) + "る";
  }
  return getRaw(verbInfo) + "られる";
}

const getPotentialShort = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      if (useKanji) {
        return dekiruKanjiStem + "る";
      }
      return "できる";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "れる";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getPotentialFull(verbInfo, useKanji);
  } 
  return getRaw(verbInfo) + "れる";
}

const getNegPotentialFull = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      if (useKanji) {
        return dekiruKanjiStem + "ない";
      }
      return "できない";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "られない";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, useKanji, 2) + "ない";
  } 
  return getRaw(verbInfo) + "られない";
}

const getNegPotentialShort = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      if (useKanji) {
        return dekiruKanjiStem + "ない";
      }
      return "できない";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "れない";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getPotentialFull(verbInfo, useKanji);
  } 
  return getRaw(verbInfo) + "れない";
}

const getPassive = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, useKanji, 0) + "れる";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "られる";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, useKanji, 0) + "れる"
  } 
  return getRaw(verbInfo) + "られる";
}

const getNegPassive = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, useKanji, 0) + "れない";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "られない";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, useKanji, 0) + "れない"
  } 
  return getRaw(verbInfo) + "られない";
}

const getCausative = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, useKanji, 0) + "せる";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "させる";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, useKanji, 0) + "せる"
  } 
  return getRaw(verbInfo) + "させる";
}

const getNegCausative = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, useKanji, 0) + "せない";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "させない";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, useKanji, 0) + "せない"
  } 
  return getRaw(verbInfo) + "させない";
}

const getCausPassive = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, useKanji, 0) + "せられる";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "させられる";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, useKanji, 0) + "せられる"
  } 
  return getRaw(verbInfo) + "させられる";
}

const getNegCausPassive = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, useKanji, 0) + "せられない";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "させられない";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, useKanji, 0) + "せられない"
  } 
  return getRaw(verbInfo) + "させられない";
}

const getImperative = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Kureru) {
      return getRaw(verbInfo);
    }
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, useKanji, 1) + "ろ";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "い";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, useKanji, 0);
  }
  return getRaw(verbInfo) + "ろ";
}

const getNegImperative = (verbInfo: ProcessedVerbInfo): string => {
  return verbInfo.verb + "な";
}

const getNasai = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getStems(verbInfo, useKanji, 1) + "なさい";
}

const getVolitional = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, useKanji, 1) + "よう";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "よう";
    }
  }
  
  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, useKanji, 3) + "う";
  }
  return getRaw(verbInfo) + "よう";
}

const getVolitionalPol = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getPoliteForm(verbInfo, useKanji, PoliteForms.Mashou);
}

const getEbaConditional = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru || verbInfo.irregular === IrregularVerbs.Kuru) {
      return getRaw(verbInfo) + "れば";
    }
  }
  return getStems(verbInfo, useKanji, 2) + "ば";
}

const getNegEbaConditional = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getNegativeForm(verbInfo, useKanji, NegativeForms.Nakereba);
}

const getTaraConditional = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getTaForm(verbInfo, useKanji) + "ら";
}

const getNegTaraConditional = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  return getNegativeForm(verbInfo, useKanji, NegativeForms.Nakattara);
}


/* Conjugation helpers */

const getPoliteForm = (verbInfo: ProcessedVerbInfo, useKanji: boolean, formType: PoliteForms): string => {
  const stem = getStems(verbInfo, useKanji, 1);

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

const getNegativeForm = (verbInfo: ProcessedVerbInfo, useKanji: boolean, formType: NegativeForms): string => {
  const stem = getNegativeStem(verbInfo, useKanji);

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

const getNegativeStem = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Aru) {
      return "な";
    }
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, useKanji, 1) + "な";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 3) + "な";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, useKanji, 0) + "な";
  }
  return getRaw(verbInfo) + "な";
}

const getStems = (verbInfo: ProcessedVerbInfo, useKanji: boolean, stemIndex: number, ): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Irassharu
    || verbInfo.irregular === IrregularVerbs.Ossharu
    || verbInfo.irregular === IrregularVerbs.Kudasaru
    || verbInfo.irregular === IrregularVerbs.Gozaru
    || verbInfo.irregular === IrregularVerbs.Nasaru) {
      return getRaw(verbInfo) + "い";
    }

    if (verbInfo.irregular === IrregularVerbs.Suru) {
      if (useKanji) {
        return getRaw(verbInfo);
      }
      return suruStems[stemIndex];
    }

    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      if (useKanji) {
        return getRaw(verbInfo);
      }
      return kuruStems[stemIndex];
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getRaw(verbInfo) + stems[getEndingChar(verbInfo)][stemIndex];
  }
  return getRaw(verbInfo);
}

const getTeForm = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Iku) {
      return getRaw(verbInfo) + "って";
    }
    if (verbInfo.irregular === IrregularVerbs.Tou) {
      return getRaw(verbInfo) + "うて";
    }
    if (verbInfo.irregular === IrregularVerbs.Suru || verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 1) + "て";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    const endingChar = getEndingChar(verbInfo);
    return getRaw(verbInfo) + tStems[endingChar] + teEndings[endingChar];
  }
  return getRaw(verbInfo) + "て";
}

const getTaForm = (verbInfo: ProcessedVerbInfo, useKanji: boolean): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Iku) {
      return getRaw(verbInfo) + "った";
    }
    if (verbInfo.irregular === IrregularVerbs.Tou) {
      return getRaw(verbInfo) + "うた";
    }
    if (verbInfo.irregular === IrregularVerbs.Suru || verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, useKanji, 1) + "た";
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

const kudasaiPlain: string = "ください";
const kudasaiKanji: string = "下さい";