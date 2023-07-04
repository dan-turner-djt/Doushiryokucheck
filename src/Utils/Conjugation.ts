import { IrregularVerbs, VerbType, dekiruKanjiStem, kuruStems, stems, suruStems, tStems, taEndings, teEndings } from "./VerbDefs";
import { FormName } from "./VerbFormDefs";

export enum PoliteForms {
  Masu, Masen, Mashita, Masendeshita, Mashite, Masende, Mashou
}

export enum NegativeForms {
  Nai, Nakute, Nakatta, Naide, Nakereba, Nakattara, Zu
}

export type ProcessedVerbInfo = {verb: string, type: VerbType, irregular: false | IrregularVerbs};

export const getConjugation = (verbInfo: ProcessedVerbInfo, form: FormName): string => {
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
  return getTeForm(verbInfo) + ((true)? kudasaiKanji : kudasaiPlain);
}

const getNegTe = (verbInfo: ProcessedVerbInfo): string => {
  return getNegativeForm(verbInfo, NegativeForms.Nakute);
}

const getNegReq = (verbInfo: ProcessedVerbInfo): string => {
  return getNaide(verbInfo) + ((true)? kudasaiKanji : kudasaiPlain);
}

const getNaide = (verbInfo: ProcessedVerbInfo): string => {
  return getNegativeForm(verbInfo, NegativeForms.Naide);
}

const getZu = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Aru) {
      return getRaw(verbInfo) + "らず";
    }
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, 2) + "ず";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "ず";
    }
  }
  
  return getNegativeForm(verbInfo, NegativeForms.Zu);
}

const getPotentialFull = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      if (true) {
        return dekiruKanjiStem + "る";
      }
      return "できる";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "られる";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 2) + "る";
  }
  return getRaw(verbInfo) + "られる";
}

const getPotentialShort = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      if (true) {
        return dekiruKanjiStem + "る";
      }
      return "できる";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "れる";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getPotentialFull(verbInfo);
  } 
  return getRaw(verbInfo) + "れる";
}

const getNegPotentialFull = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      if (true) {
        return dekiruKanjiStem + "ない";
      }
      return "できない";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "られない";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 2) + "ない";
  } 
  return getRaw(verbInfo) + "られない";
}

const getNegPotentialShort = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      if (true) {
        return dekiruKanjiStem + "ない";
      }
      return "できない";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "れない";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getNegPotentialFull(verbInfo);
  } 
  return getRaw(verbInfo) + "れない";
}

const getPassive = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, 0) + "れる";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "られる";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "れる"
  } 
  return getRaw(verbInfo) + "られる";
}

const getNegPassive = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, 0) + "れない";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "られない";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "れない"
  } 
  return getRaw(verbInfo) + "られない";
}

const getCausative = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, 0) + "せる";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "させる";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "せる"
  } 
  return getRaw(verbInfo) + "させる";
}

const getNegCausative = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, 0) + "せない";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "させない";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "せない"
  } 
  return getRaw(verbInfo) + "させない";
}

const getCausPassive = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, 0) + "せられる";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "させられる";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "せられる"
  } 
  return getRaw(verbInfo) + "させられる";
}

const getNegCausPassive = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, 0) + "せられない";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "させられない";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "せられない"
  } 
  return getRaw(verbInfo) + "させられない";
}

const getImperative = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Kureru) {
      return getRaw(verbInfo);
    }
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, 1) + "ろ";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "い";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 2);
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
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, 1) + "よう";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "よう";
    }
  }
  
  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 3) + "う";
  }
  return getRaw(verbInfo) + "よう";
}

const getVolitionalPol = (verbInfo: ProcessedVerbInfo): string => {
  return getPoliteForm(verbInfo, PoliteForms.Mashou);
}

const getEbaConditional = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Suru || verbInfo.irregular === IrregularVerbs.Kuru) {
      return getRaw(verbInfo) + "れば";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 2) + "ば";
  }
  return getRaw(verbInfo) + "れば";
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
      return getStems(verbInfo, 0) + "ず";
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
    if (verbInfo.irregular === IrregularVerbs.Suru) {
      return getStems(verbInfo, 1) + "な";
    }
    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 3) + "な";
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 0) + "な";
  }
  return getRaw(verbInfo) + "な";
}

const getStems = (verbInfo: ProcessedVerbInfo, stemIndex: number, ): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Irassharu
    || verbInfo.irregular === IrregularVerbs.Ossharu
    || verbInfo.irregular === IrregularVerbs.Kudasaru
    || verbInfo.irregular === IrregularVerbs.Gozaru
    || verbInfo.irregular === IrregularVerbs.Nasaru) {
      return getRaw(verbInfo) + "い";
    }

    if (verbInfo.irregular === IrregularVerbs.Suru) {
      if (true) {
        return getRaw(verbInfo);
      }
      return suruStems[stemIndex];
    }

    if (verbInfo.irregular === IrregularVerbs.Kuru) {
      if (true) {
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

const getTeForm = (verbInfo: ProcessedVerbInfo): string => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === IrregularVerbs.Iku) {
      return getRaw(verbInfo) + "って";
    }
    if (verbInfo.irregular === IrregularVerbs.Tou) {
      return getRaw(verbInfo) + "うて";
    }
    if (verbInfo.irregular === IrregularVerbs.Suru || verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 1) + "て";
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
    if (verbInfo.irregular === IrregularVerbs.Suru || verbInfo.irregular === IrregularVerbs.Kuru) {
      return getStems(verbInfo, 1) + "た";
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