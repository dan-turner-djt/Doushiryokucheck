export enum VerbType {
  Ichidan, Godan, Irregular
}

export type VerbInfo = {verb: string, type: VerbType};

export const verbsList: VerbInfo[] = [
  {verb: "食べる", type: VerbType.Ichidan},
  {verb: "書く", type: VerbType.Godan},
  {verb: "読む", type: VerbType.Godan},
  {verb: "いる", type: VerbType.Ichidan},
  {verb: "歩く", type: VerbType.Godan},
  {verb: "走る", type: VerbType.Godan}
]