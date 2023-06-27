import { VerbInfo, VerbType } from "./VerbDefs";

export enum PoliteForms {
  Masu, Masen, Mashita, Masendeshita, Mashite, Masende, Mashou
}

export enum NegativeForms {
  Nai, Nakute, Nakatta, Naide, Nakereba, Nakattara
}

export const getPoliteForm = (verbInfo: VerbInfo, formType: PoliteForms): string => {
  const stem = getStem(verbInfo, 1);

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

export const getNegativeForm = (verbInfo: VerbInfo, formType: NegativeForms): string => {
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
    default:
      console.log("Unknown negative form");
      return stem;
  }
}

export const getPotentialForm = (verbInfo: VerbInfo): string => {
  switch (verbInfo.type) {
    case VerbType.Irregular:
      return verbInfo.verb;
    case VerbType.Godan:
      return getRaw(verbInfo) + stems[getEndingChar(verbInfo)][2] + "る";
    default:
      // Default to Ichidan
      return getRaw(verbInfo) + "れる";
  }
}

export const getVolitionalForm = (verbInfo: VerbInfo): string => {
  switch (verbInfo.type) {
    case VerbType.Irregular:
      return verbInfo.verb;
    case VerbType.Godan:
      return getRaw(verbInfo) + stems[getEndingChar(verbInfo)][3] + "う";
    default:
      // Default to Ichidan
      return getRaw(verbInfo) + "よう";
  }
}

export const getNegativeStem = (verbInfo: VerbInfo): string => {
  switch (verbInfo.type) {
    case VerbType.Irregular:
      return verbInfo.verb;
    case VerbType.Godan:
      return getRaw(verbInfo) + stems[getEndingChar(verbInfo)][0] + "な";
    default:
      // Default to Ichidan
      return getRaw(verbInfo) + "な";
  }
}

const getStem = (verbInfo: VerbInfo, stemIndex: number): string => {
  switch (verbInfo.type) {
    case VerbType.Irregular:
      return verbInfo.verb;
    case VerbType.Godan:
      return getRaw(verbInfo) + stems[getEndingChar(verbInfo)][stemIndex];
    default:
      // Default to Ichidan
      return getRaw(verbInfo);
  }
}

export const getTeForm = (verbInfo: VerbInfo): string => {
  switch (verbInfo.type) {
    case VerbType.Irregular:
      return verbInfo.verb;
    case VerbType.Godan:
      const endingChar = getEndingChar(verbInfo);
      return getRaw(verbInfo) + tStems[endingChar] + teEndings[endingChar];
    default:
      // Default to Ichidan
      return getRaw(verbInfo) + "て";
  }
}

export const getTaForm = (verbInfo: VerbInfo): string => {
  switch (verbInfo.type) {
    case VerbType.Irregular:
      return verbInfo.verb;
    case VerbType.Godan:
      const endingChar = getEndingChar(verbInfo);
      return getRaw(verbInfo) + tStems[endingChar] + taEndings[endingChar];
    default:
      // Default to Ichidan
      return getRaw(verbInfo) + "た";
  }
}

const getRaw = (verbInfo: VerbInfo): string => {
  return verbInfo.verb.slice(0, -1);
}

const getEndingChar = (verbInfo: VerbInfo): string => {
  return verbInfo.verb.slice(-1);
}


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