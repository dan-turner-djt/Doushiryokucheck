import React, { useState } from "react";
import SettingsForm from "../Components/SettingsForm";
import TestForm from "../Components/TestForm";

const Home = () => {

  const [inTest, setInTest] = useState<boolean>(false);

  const handleSubmitSettingsForm = () => {
    startNewTest();
  }

  const startNewTest = () => {
    setInTest(true);
  }

  const quitTest = () => {
    setInTest(false);
  }

  return (
    <div className="home">
      <h2 className="page-title">Welcome</h2>
      <div className="content">
        <p>Welcome!</p>
      </div>
      <div>
        {inTest && 
          <TestForm quitHandler={ quitTest }></TestForm>
        }
        {!inTest && 
          <SettingsForm submitHandler={ handleSubmitSettingsForm }></SettingsForm>
        }
      </div>
    </div>
  );
}
 
export default Home;