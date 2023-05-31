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