import React, { ChangeEvent, useState } from "react";
import { DefaultSettings, SettingsObject, TestType, getTestTypeDefaultSettings, getTestTypeName, AmountSettingsObject, TimedSettingsObject } from "../SettingsDef";

export type SettingsFormProps = {
  initialSettings: SettingsObject;
  submitHandler: (newSettings: SettingsObject) => void;
}

const SettingsForm = (props: SettingsFormProps) => {
  const [currentSettings, setCurrentSettings] = useState<SettingsObject>(props.initialSettings);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.submitHandler(currentSettings);
  }

  const handleTestTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentSettings({...currentSettings, testType: Number(e.target.value), testTypeObject: getTestTypeDefaultSettings(Number(e.target.value))});
  }

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    let toSet: number = Number(e.target.value);
    if (isNaN(toSet)) {
      return;
    }
    setCurrentSettings({...currentSettings, testTypeObject: {...currentSettings.testTypeObject, amount: toSet}});
  }

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    let toSet: number = Number(e.target.value);
    if (isNaN(toSet)) {
      return;
    }
    setCurrentSettings({...currentSettings, testTypeObject: {...currentSettings.testTypeObject, time: toSet}});
  }

  const handleRestoreDefaults = () => {
    setCurrentSettings(DefaultSettings);
  }

  return (
    <form className="form settings-form" onSubmit={ handleSubmit }>
      <fieldset>
        <legend>Settings</legend>
        <label>Choose a test mode</label>
        <select
          value={currentSettings.testType}
          onChange={handleTestTypeChange}>
          <optgroup>
            <option value={TestType.Amount}>{ getTestTypeName(TestType.Amount) }</option>
            <option value={TestType.Endless}>{ getTestTypeName(TestType.Endless) }</option>
            <option value={TestType.Timed}>{ getTestTypeName(TestType.Timed) }</option>
          </optgroup>
        </select>
        <div className="type-sub-form">
          {currentSettings.testType === TestType.Amount && <div className="amount-sub-form">
            <label>Word amount</label>
            <input value={(currentSettings.testTypeObject as AmountSettingsObject).amount} onChange={handleAmountChange}></input>
          </div>}
          {currentSettings.testType === TestType.Endless && <div className="endless-sub-form">
          </div>}
          {currentSettings.testType === TestType.Timed && <div className="timed-sub-form">
            <label>Time limit (seconds)</label>
            <input value={(currentSettings.testTypeObject as TimedSettingsObject).time} onChange={handleTimeChange}></input>
          </div>}
        </div>
        <div className="form-button-row">
          <button type="button" className="button-primary" onClick={ handleRestoreDefaults }>Restore Defaults</button>
          <button type="submit" className="button-primary">Start</button>
        </div>
      </fieldset>
    </form>
  );
}
 
export default SettingsForm;