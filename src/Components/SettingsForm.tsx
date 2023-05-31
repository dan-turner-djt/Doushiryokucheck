import React, { ChangeEvent, useState } from "react";
import { DefaultSettings, SettingsObject, TestType, getTestTypeName } from "../SettingsDef";

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
    setCurrentSettings({...currentSettings, testType: Number(e.target.value)});
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
        <div className="form-button-row">
          <button type="button" className="button-primary" onClick={ handleRestoreDefaults }>Restore Defaults</button>
          <button type="submit" className="button-primary">Start</button>
        </div>
      </fieldset>
    </form>
  );
}
 
export default SettingsForm;