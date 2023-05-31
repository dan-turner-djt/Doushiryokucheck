import React, { useState } from "react";
import { DefaultSettings, SettingsObject } from "../SettingsDef";

export type SettingsFormProps = {
  submitHandler: (newSettings: SettingsObject) => void;
}

const SettingsForm = (props: SettingsFormProps) => {
  const [currentSettings, setCurrentSettings] = useState<SettingsObject>(DefaultSettings);

  const handleSubmit = () => {
    props.submitHandler(currentSettings);
  }

  return (
    <form className="form settings-form" onSubmit={ handleSubmit }>
      <fieldset>
        <legend>Settings</legend>
        <div className="form-button">
          <button type="submit" className="button-primary">Start</button>
        </div>
      </fieldset>
    </form>
  );
}
 
export default SettingsForm;