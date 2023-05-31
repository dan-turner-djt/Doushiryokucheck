import React, { useState } from "react";
import { SettingsObject, getTestTypeName } from "../SettingsDef";

export type TestFormProps = {
  testSettings: SettingsObject;
  quitHandler: () => void;
}

const TestForm = (props: TestFormProps) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  const quitTest = () => {
    props.quitHandler();
  }

  return (
    <form className="form test-form" onSubmit={ handleSubmit }>
      <fieldset>
        <legend>{ getTestTypeName(props.testSettings.testType) }</legend>
        <div className="form-button-row">
          <button type="submit" className="button-primary">Check</button>
          <button type="button" className="button-primary" onClick={ quitTest }>Quit</button>
        </div>
      </fieldset>
    </form>
  );
}
 
export default TestForm;