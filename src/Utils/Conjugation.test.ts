import { ProcessedVerbInfo, getConjugation } from "./Conjugation"
import { VerbInfo, VerbType } from "./VerbDefs"
import { FormName } from "./VerbFormDefs";

/*describe('Ichidan conjugation', () => {
  it ('conjugates 見る correctly', () => {
    const verbInfo: ProcessedVerbInfo = {verb: "見る", type: VerbType.Ichidan, irregular: false};
    const useKanji = true;

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const result = getConjugation(verbInfo, Number(value), useKanji);
      const expected = miruConjugations.find(o => o.form === Number(value))?.expected;
      expect(result).toEqual(expected);
    }
  });
  
})

describe('Godan conjugation', () => {
  it ('conjugates 会う correctly', () => {
    const verbInfo: ProcessedVerbInfo = {verb: "会う", type: VerbType.Godan, irregular: false};
    const useKanji = true;

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const result = getConjugation(verbInfo, Number(value), useKanji);
      const expected = auConjugations.find(o => o.form === Number(value))?.expected;
      expect(result).toEqual(expected);
    }
  });
})*/




/* Expected results */

const miruConjugations: {form: FormName, expected: string}[] = [
  {form: FormName.Stem, expected: "見"},
  {form: FormName.Present, expected: "見る"},
  {form: FormName.PresentPol, expected: "見ます"},
  {form: FormName.Negative, expected: "見ない"},
  {form: FormName.NegPol, expected: "見ません"},
  {form: FormName.Past, expected: "見た"},
  {form: FormName.PastPol, expected: "見ました"},
  {form: FormName.NegPast, expected: "見なかった"},
  {form: FormName.NegPastPol, expected: "見ませんでした"},
  {form: FormName.Te, expected: "見て"},
  {form: FormName.TeReq, expected: "見て下さい"},
  {form: FormName.NegTe, expected: "見なくて"},
  {form: FormName.NegReq, expected: "見ないで下さい"},
  {form: FormName.Naide, expected: "見ないで"},
  {form: FormName.Zu, expected: "見ず"},
  {form: FormName.PotentialFull, expected: "見られる"},
  {form: FormName.PotentialShort, expected: "見れる"},
  {form: FormName.NegPotentialFull, expected: "見られない"},
  {form: FormName.NegPotentialShort, expected: "見れない"},
  {form: FormName.Passive, expected: "見られる"},
  {form: FormName.NegPassive, expected: "見られない"},
  {form: FormName.Causative, expected: "見させる"},
  {form: FormName.NegCausative, expected: "見させない"},
  {form: FormName.CausPassive, expected: "見させられる"},
  {form: FormName.NegCausPassive, expected: "見させられない"},
  {form: FormName.Imperative, expected: "見ろ"},
  {form: FormName.NegImperative, expected: "見るな"},
  {form: FormName.Nasai, expected: "見なさい"},
  {form: FormName.Volitional, expected: "見よう"},
  {form: FormName.VolitionalPol, expected: "見ましょう"},
  {form: FormName.BaConditional, expected: "見れば"},
  {form: FormName.NegBaConditional, expected: "見なければ"},
  {form: FormName.TaraConditional, expected: "見たら"},
  {form: FormName.NegTaraConditional, expected: "見なかったら"}
]

const auConjugations: {form: FormName, expected: string}[] = [
  {form: FormName.Stem, expected: "会い"},
  {form: FormName.Present, expected: "会う"},
  {form: FormName.PresentPol, expected: "会います"},
  {form: FormName.Negative, expected: "会わない"},
  {form: FormName.NegPol, expected: "会いません"},
  {form: FormName.Past, expected: "会った"},
  {form: FormName.PastPol, expected: "会いました"},
  {form: FormName.NegPast, expected: "会わなかった"},
  {form: FormName.NegPastPol, expected: "会いませんでした"},
  {form: FormName.Te, expected: "会って"},
  {form: FormName.TeReq, expected: "会って下さい"},
  {form: FormName.NegTe, expected: "会わなくて"},
  {form: FormName.NegReq, expected: "会わないで下さい"},
  {form: FormName.Naide, expected: "会わないで"},
  {form: FormName.Zu, expected: "会わず"},
  {form: FormName.PotentialFull, expected: "会える"},
  {form: FormName.PotentialShort, expected: "会える"},
  {form: FormName.NegPotentialFull, expected: "会えない"},
  {form: FormName.NegPotentialShort, expected: "会えない"},
  {form: FormName.Passive, expected: "会われる"},
  {form: FormName.NegPassive, expected: "会われない"},
  {form: FormName.Causative, expected: "会わせる"},
  {form: FormName.NegCausative, expected: "会わせない"},
  {form: FormName.CausPassive, expected: "会わせられる"},
  {form: FormName.NegCausPassive, expected: "会わせられない"},
  {form: FormName.Imperative, expected: "会え"},
  {form: FormName.NegImperative, expected: "会うな"},
  {form: FormName.Nasai, expected: "会いなさい"},
  {form: FormName.Volitional, expected: "会おう"},
  {form: FormName.VolitionalPol, expected: "会いましょう"},
  {form: FormName.BaConditional, expected: "会えば"},
  {form: FormName.NegBaConditional, expected: "会わなければ"},
  {form: FormName.TaraConditional, expected: "会ったら"},
  {form: FormName.NegTaraConditional, expected: "会わなかったら"}
]