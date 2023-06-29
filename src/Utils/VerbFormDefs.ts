import { getCausPassive, getCausative, getEbaConditional, getImperative, getNaide, getNasai, getNegCausPassive, getNegCausative, getNegEbaConditional, getNegImperative, getNegPassive, getNegPast, getNegPastPol, getNegPol, getNegPotentialFull, getNegPotentialShort, getNegReq, getNegTaraConditional, getNegTe, getNegative, getPassive, getPast, getPastPol, getPotentialFull, getPotentialShort, getPresent, getPresentPol, getTaraConditional, getTe, getTeReq, getVolitional, getVolitionalPol, getZu } from "./Conjugation";

export const enum formType {
  a, i, u, e, o, t
}

export type formInfo = {name: string, type: formType, func?: Function };

export const allVerbForms: { [index: string]: formInfo } = {
  present:            {name: "Present plain",               type: formType.u, func: getPresent},
  presentPol:         {name: "Present polite",              type: formType.i, func: getPresentPol},
  negative:           {name: "Negative plain",              type: formType.a, func: getNegative},
  negPol:             {name: "Negative polite",             type: formType.u, func: getNegPol},
  past:               {name: "Past plain",                  type: formType.t, func: getPast},
  pastPol:            {name: "Past polite",                 type: formType.i, func: getPastPol},
  negPast:            {name: "Negative past plain",         type: formType.a, func: getNegPast},
  negPastPol:         {name: "Negative past polite",        type: formType.i, func: getNegPastPol},
  te:                 {name: "Te form",                     type: formType.t, func: getTe},
  teReq:              {name: "Request",                     type: formType.t, func: getTeReq},
  negTe:              {name: "Negative Te form",            type: formType.a, func: getNegTe},
  negReq:             {name: "Negative request",            type: formType.a, func: getNegReq},
  naide:              {name: "Without ~",                   type: formType.a, func: getNaide},
  zu:                 {name: "Without ~ formal",            type: formType.a, func: getZu},
  potentialFull:      {name: "Potential",                   type: formType.e, func: getPotentialFull},
  potentialShort:     {name: "Potential (short)",           type: formType.e, func: getPotentialShort},
  negPotentialFull:   {name: "Negative potential",          type: formType.e, func: getNegPotentialFull},
  negPotentialShort:  {name: "Negative potential (short)",  type: formType.e, func: getNegPotentialShort},
  passive:            {name: "Passive",                     type: formType.a, func: getPassive},
  negPassive:         {name: "Negative passive",            type: formType.a, func: getNegPassive},
  causative:          {name: "Causative",                   type: formType.a, func: getCausative},
  negCausative:       {name: "Negative causative",          type: formType.a, func: getNegCausative},
  causPassive:        {name: "Causative passive",           type: formType.a, func: getCausPassive},
  negCausPassive:     {name: "Negative causative passive",  type: formType.a, func: getNegCausPassive},
  imperative:         {name: "Imperative",                  type: formType.e, func: getImperative},
  negImperative:      {name: "Negative imperative",         type: formType.u, func: getNegImperative},
  nasai:              {name: "Imperative (nasai)",          type: formType.i, func: getNasai},
  volitional:         {name: "Volitional",                  type: formType.o, func: getVolitional},
  volitionalPol:      {name: "Volitional polite",           type: formType.i, func: getVolitionalPol},
  baConditional:      {name: "Conditional (eba)",           type: formType.e, func: getEbaConditional},
  negBaConditional:   {name: "Negative conditional (eba)",  type: formType.a, func: getNegEbaConditional},
  taraConditional:    {name: "Conditional (tara)",          type: formType.t, func: getTaraConditional},
  negTaraConditional: {name: "Negative conditional (tara)", type: formType.a, func: getNegTaraConditional},
}