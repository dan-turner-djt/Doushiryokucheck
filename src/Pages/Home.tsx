import React, { useState } from "react";
import SettingsForm from "../Components/SettingsForm";
import TestForm from "../Components/TestForm";
import { DefaultSettings, SettingsObject } from "../SettingsDef";

const Home = () => {

  const [inTest, setInTest] = useState<boolean>(false);
  const [currentSettings, setCurrentSettings] = useState<SettingsObject>(DefaultSettings);

  const handleSubmitSettingsForm = (newSettings: SettingsObject) => {
    setCurrentSettings(newSettings);
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
      <h2 className="page-title">Japanese Verb Conjugation Tester</h2>
      <div className="content">
        <p>Welcome!</p>
      </div>
      <div>
        {inTest && 
          <TestForm testSettings={ currentSettings } quitHandler={ quitTest }></TestForm>
        }
        {!inTest && 
          <SettingsForm initialSettings={currentSettings} submitHandler={ handleSubmitSettingsForm }></SettingsForm>
        }
      </div>
    </div>
  );
}
 
export default Home;