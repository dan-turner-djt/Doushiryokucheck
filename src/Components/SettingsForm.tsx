import React from "react";
import { DefaultSettings, SettingsObject, TestType, getTestTypeDefaultSettings, getTestTypeName, DefaultAmountSettings, DefaultTimedSettings } from "../SettingsDef";
import Field, { FieldRef, StaticFieldData } from "./Field";

export type SettingsFormProps = {
  initialSettings: SettingsObject;
  submitHandler: (newSettings: SettingsObject) => void;
}

const SettingsForm = (props: SettingsFormProps) => {
  const [currentSettings, setCurrentSettings] = React.useState<SettingsObject>(props.initialSettings);
  
  const wordAmountRef = React.useRef<React.ElementRef<typeof Field>>(null);
  const timeLimitRef = React.useRef<React.ElementRef<typeof Field>>(null);
  const [fieldData, setFieldData] = React.useState({
    wordAmount: {
      staticData: {
        label: "Word Amount",
        minimum: 1, maximum: 100,
        startingValue: DefaultAmountSettings.amount
      },
      valid: true,
      focus: false,
      ref: wordAmountRef
    },
    timeLimit: {
      staticData: {
        label: "Time Limit (seconds)",
        minimum: 1, maximum: 3600,
        startingValue: DefaultTimedSettings.time
      }, 
      valid: true, 
      focus: false,
      ref: timeLimitRef
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const firstInvalidField: React.RefObject<FieldRef> | undefined = getFirstInvalidField();
    if (!firstInvalidField) {
      // Form is valid, submit
      props.submitHandler(currentSettings);
    } else {
      if (firstInvalidField.current) {
        firstInvalidField.current.giveFocus();
      }
    }
  }

  const getFirstInvalidField = (): React.RefObject<FieldRef> | undefined => {
    let result: React.RefObject<FieldRef> | undefined;
    Object.values(fieldData).forEach((o: {staticData: StaticFieldData, valid: boolean, focus: boolean, ref: React.RefObject<FieldRef>}) => {
      if (o.valid === false) {
        result = o.ref;
        return;
      } 
    });

    return result;
  }

  const handleTestTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSettings({...currentSettings, testType: Number(e.target.value), testTypeObject: getTestTypeDefaultSettings(Number(e.target.value))});

    // Reset these fields' validity which belong to test type sub settings
    setFieldData({...fieldData, 
      wordAmount: {...fieldData.wordAmount, valid: true}, 
      timeLimit: {...fieldData.timeLimit, valid: true}
    });
  }

  const setNewWordAmount = (newWordAmount: number, valid: boolean) => {
    setCurrentSettings({...currentSettings, testTypeObject: {...currentSettings.testTypeObject, amount: newWordAmount}});
    setFieldData({...fieldData, wordAmount: {...fieldData.wordAmount, valid: valid}});
    
  }

  const setNewTime = (newTime: number, valid: boolean) => {
    setCurrentSettings({...currentSettings, testTypeObject: {...currentSettings.testTypeObject, time: newTime}});
    setFieldData({...fieldData, timeLimit: {...fieldData.timeLimit, valid: valid}});
  }

  const handleRestoreDefaults = () => {
    setCurrentSettings(DefaultSettings);

    // Reset each field's value and validity
    for (const [key, value] of Object.entries(fieldData)) {
      value.ref.current?.resetValue();
      value.valid = true;
      setFieldData({...fieldData, [key]: value});
    }
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
            <Field
              ref={ wordAmountRef }
              staticData={ fieldData.wordAmount.staticData }
              focus={ fieldData.wordAmount.focus }
              valueSetter={ setNewWordAmount }></Field>
          </div>}
          {currentSettings.testType === TestType.Endless && <div className="endless-sub-form">
          </div>}
          {currentSettings.testType === TestType.Timed && <div className="timed-sub-form">
            <Field
              ref={ timeLimitRef }
              staticData={ fieldData.timeLimit.staticData }
              focus={ fieldData.timeLimit.focus }
              valueSetter={ setNewTime }></Field>
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