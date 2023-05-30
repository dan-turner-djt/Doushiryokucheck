import React, { useState } from "react";

export type TestFormProps = {
  quitHandler: () => void;
}

const TestForm = (props: TestFormProps) => {
  const [testName, setTestName] = useState<string>("Free-mode Test");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  const quitTest = () => {
    props.quitHandler();
  }

  return (
    <form className="form test-form" onSubmit={ handleSubmit }>
      <fieldset>
        <legend>{ testName }</legend>
        <div className="form-button-row">
          <button type="submit" className="button-primary">Check</button>
          <button type="button" className="button-primary" onClick={ quitTest }>Quit</button>
        </div>
      </fieldset>
    </form>
  );
}
 
export default TestForm;