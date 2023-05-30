import React from "react";

export type SettingsFormProps = {
  submitHandler: () => void;
}

const SettingsForm = (props: SettingsFormProps) => {

  const handleSubmit = () => {
    props.submitHandler();
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