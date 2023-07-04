import { ConjugationResult, ProcessedVerbInfo, getConjugation, processAndGetConjugation, processConjugationResult, processVerbInfo } from "./Conjugation"
import { IrregularVerbs, VerbInfo, VerbType } from "./VerbDefs"
import { FormName } from "./VerbFormDefs";

it('processes verb info properly', () => {
  const rawVerbInfoTaberu: VerbInfo = {verb: {kanji: "食べる", kana: "たべる"}, type: VerbType.Ichidan, irregular: false};
  const processedVerbInfo: ProcessedVerbInfo = processVerbInfo(rawVerbInfoTaberu);
  expect(processedVerbInfo).toEqual(
    {rawStem: {kanji: "食べ", kana: "たべ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false}
  )
});

describe('Process conjugation results', () => {
  it('processes the basic suffix properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kanji: "食べ", kana: "たべ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};
    const conjugationResult: ConjugationResult = {suffix: "ない"};
    const results: string[] = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(results).toEqual(["食べない", "たべない"]); 
  });

  it('processes the suffix and new kana and kanji stems properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kanji: "為", kana: "す"}, endingChar: "る", type: VerbType.Ichidan, irregular: IrregularVerbs.Suru};
    const conjugationResult: ConjugationResult = {suffix: "ない", newKanjiRawStem: "出来", newKanaRawStem: "でき"};
    const results: string[] = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(results).toEqual(["出来ない", "できない"]); 
  });

  it('processes full info with kudasai properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kanji: "為", kana: "す"}, endingChar: "る", type: VerbType.Ichidan, irregular: IrregularVerbs.Suru};
    const conjugationResult: ConjugationResult = {suffix: "ないで", newKanjiRawStem: "出来", newKanaRawStem: "でき", kudasai: true};
    const results: string[] = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(results).toEqual(["出来ないで下さい", "出来ないでください", "できないで下さい", "できないでください"]);
  });
});


describe('Ichidan conjugation', () => {
  it ('conjugates 見る correctly', () => {
    const verbInfo: VerbInfo = {verb: {kanji: "見る", kana: "みる"}, type: VerbType.Ichidan, irregular: false};

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const results: string[] = processAndGetConjugation(verbInfo, Number(value));
      const expected = miruConjugations.find(o => o.form === Number(value))?.expected;
      expect(results).toEqual(expected);
    }
  });
  
})

describe('Godan conjugation', () => {
  it ('conjugates 会う correctly', () => {
    const verbInfo: VerbInfo = {verb: {kanji: "会う", kana: "あう"}, type: VerbType.Godan, irregular: false};

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const results: string[] = processAndGetConjugation(verbInfo, Number(value));
      const expected = auConjugations.find(o => o.form === Number(value))?.expected;
      expect(results).toEqual(expected);
    }
  });
})




/* Expected results */

const miruConjugations: {form: FormName, expected: string[]}[] = [
  {form: FormName.Stem, expected: ["見", "み"]},
  {form: FormName.Present, expected: ["見る", "みる"]},
  {form: FormName.PresentPol, expected: ["見ます", "みます"]},
  {form: FormName.Negative, expected: ["見ない", "みない"]},
  {form: FormName.NegPol, expected: ["見ません", "みません"]},
  {form: FormName.Past, expected: ["見た", "みた"]},
  {form: FormName.PastPol, expected: ["見ました", "みました"]},
  {form: FormName.NegPast, expected: ["見なかった", "みなかった"]},
  {form: FormName.NegPastPol, expected: ["見ませんでした", "みませんでした"]},
  {form: FormName.Te, expected: ["見て", "みて"]},
  {form: FormName.TeReq, expected: ["見て下さい", "見てください", "みて下さい", "みてください"]},
  {form: FormName.NegTe, expected: ["見なくて", "みなくて"]},
  {form: FormName.NegReq, expected: ["見ないで下さい", "見ないでください", "みないで下さい", "みないでください"]},
  {form: FormName.Naide, expected: ["見ないで", "みないで"]},
  {form: FormName.Zu, expected: ["見ず", "みず"]},
  {form: FormName.PotentialFull, expected: ["見られる", "みられる"]},
  {form: FormName.PotentialShort, expected: ["見れる", "みれる"]},
  {form: FormName.NegPotentialFull, expected: ["見られない", "みられない"]},
  {form: FormName.NegPotentialShort, expected: ["見れない", "みれない"]},
  {form: FormName.Passive, expected: ["見られる", "みられる"]},
  {form: FormName.NegPassive, expected: ["見られない", "みられない"]},
  {form: FormName.Causative, expected: ["見させる", "みさせる"]},
  {form: FormName.NegCausative, expected: ["見させない", "みさせない"]},
  {form: FormName.CausPassive, expected: ["見させられる", "みさせられる"]},
  {form: FormName.NegCausPassive, expected: ["見させられない", "みさせられない"]},
  {form: FormName.Imperative, expected: ["見ろ", "みろ"]},
  {form: FormName.NegImperative, expected: ["見るな", "みるな"]},
  {form: FormName.Nasai, expected: ["見なさい", "みなさい"]},
  {form: FormName.Volitional, expected: ["見よう", "みよう"]},
  {form: FormName.VolitionalPol, expected: ["見ましょう", "みましょう"]},
  {form: FormName.BaConditional, expected: ["見れば", "みれば"]},
  {form: FormName.NegBaConditional, expected: ["見なければ", "みなければ"]},
  {form: FormName.TaraConditional, expected: ["見たら", "みたら"]},
  {form: FormName.NegTaraConditional, expected: ["見なかったら", "みなかったら"]}
]

const auConjugations: {form: FormName, expected: string[]}[] = [
  {form: FormName.Stem, expected: ["会い", "あい"]},
  {form: FormName.Present, expected: ["会う", "あう"]},
  {form: FormName.PresentPol, expected: ["会います", "あいます"]},
  {form: FormName.Negative, expected: ["会わない", "あわない"]},
  {form: FormName.NegPol, expected: ["会いません", "あいません"]},
  {form: FormName.Past, expected: ["会った", "あった"]},
  {form: FormName.PastPol, expected: ["会いました", "あいました"]},
  {form: FormName.NegPast, expected: ["会わなかった", "あわなかった"]},
  {form: FormName.NegPastPol, expected: ["会いませんでした", "あいませんでした"]},
  {form: FormName.Te, expected: ["会って", "あって"]},
  {form: FormName.TeReq, expected: ["会って下さい", "会ってください", "あって下さい", "あってください"]},
  {form: FormName.NegTe, expected: ["会わなくて", "あわなくて"]},
  {form: FormName.NegReq, expected: ["会わないで下さい", "会わないでください", "あわないで下さい", "あわないでください"]},
  {form: FormName.Naide, expected: ["会わないで", "あわないで"]},
  {form: FormName.Zu, expected: ["会わず", "あわず"]},
  {form: FormName.PotentialFull, expected: ["会える", "あえる"]},
  {form: FormName.PotentialShort, expected: ["会える", "あえる"]},
  {form: FormName.NegPotentialFull, expected: ["会えない", "あえない"]},
  {form: FormName.NegPotentialShort, expected: ["会えない", "あえない"]},
  {form: FormName.Passive, expected: ["会われる", "あわれる"]},
  {form: FormName.NegPassive, expected: ["会われない", "あわれない"]},
  {form: FormName.Causative, expected: ["会わせる", "あわせる"]},
  {form: FormName.NegCausative, expected: ["会わせない", "あわせない"]},
  {form: FormName.CausPassive, expected: ["会わせられる", "あわせられる"]},
  {form: FormName.NegCausPassive, expected: ["会わせられない", "あわせられない"]},
  {form: FormName.Imperative, expected: ["会え", "あえ"]},
  {form: FormName.NegImperative, expected: ["会うな", "あうな"]},
  {form: FormName.Nasai, expected: ["会いなさい", "あいなさい"]},
  {form: FormName.Volitional, expected: ["会おう", "あおう"]},
  {form: FormName.VolitionalPol, expected: ["会いましょう", "あいましょう"]},
  {form: FormName.BaConditional, expected: ["会えば", "あえば"]},
  {form: FormName.NegBaConditional, expected: ["会わなければ", "あわなければ"]},
  {form: FormName.TaraConditional, expected: ["会ったら", "あったら"]},
  {form: FormName.NegTaraConditional, expected: ["会わなかったら", "あわなかったら"]}
]