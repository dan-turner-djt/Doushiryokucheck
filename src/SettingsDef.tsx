/* Type definitions */

export enum TestType {
  Amount, Endless, Timed
}

export type AmountSettingsObject = {
  amount: number
}

export type EndlessSettingsObject = {
}

export type TimedSettingsObject = {
  time: number
}

export type SettingsObject = {
  testType: TestType
  testTypeObject: AmountSettingsObject | EndlessSettingsObject | TimedSettingsObject
}


/* Default settings definitions */

export const DefaultAmountSettings: AmountSettingsObject = {
  amount: 20
}

export const DefaultEndlessSettings: EndlessSettingsObject = {
}

export const DefaultTimedSettings: TimedSettingsObject = {
  time: 60
}

export const DefaultSettings: SettingsObject = {
  testType: TestType.Amount,
  testTypeObject: DefaultAmountSettings
}

/* Name definitions */

export const getTestTypeName = (testType: TestType):string => {
  switch (testType) {
    case TestType.Endless: {
      return "Unlimited Amount Test"
    }
    case TestType.Timed: {
      return "Timed Test"
    }
    default: {
      return "Set Amount Test"
    }
  }
}