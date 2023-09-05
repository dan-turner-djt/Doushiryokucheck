import { useEffect, useState } from "react";
import SettingsForm from "../../Components/SettingsForm/SettingsForm";
import TestForm from "../../Components/TestForm/TestForm";
import { DefaultSettings, SettingsObject } from "../../SettingsDef";
import { getVerbList } from "../../api/JishoRequests";
import { VerbFormsInfo, converVerbFormsInfo } from "../../Utils/VerbFormsInfo";

const enum InTestState {
	True, False, Loading
} 

const Home = () => {

	const [inTest, setInTest] = useState<InTestState>(InTestState.False);
	const [currentSettings, setCurrentSettings] = useState<SettingsObject>(DefaultSettings);
	const [verbFormsInfo, setVerbFormsInfo] = useState<VerbFormsInfo>([]);

	useEffect(() => {
		if(inTest === InTestState.False) {
			return;
		}
		setVerbFormsInfo(converVerbFormsInfo(currentSettings.verbForms));
		console.log(verbFormsInfo);

		setInTest(InTestState.True);
		
	}, [currentSettings]);

	const handleSubmitSettingsForm = (newSettings: SettingsObject) => {
		setInTest(InTestState.Loading);
		setCurrentSettings(newSettings);
		//getVerbList(newSettings);
	};

	const quitTest = () => {
		setInTest(InTestState.False);
	};

	return (
		<div className="home">
			<h2 className="page-title">Japanese Verb Conjugation Tester</h2>
			<div className="content">
				<p>Welcome!</p>
			</div>
			<div>
				{(inTest === InTestState.True) && 
          <TestForm testSettings={ currentSettings } inTest={ true } verbFormsInfo={ verbFormsInfo } quitHandler={ quitTest }/>
				}
				{(inTest !== InTestState.True) && 
          <SettingsForm initialSettings={currentSettings} submitHandler={ handleSubmitSettingsForm }></SettingsForm>
				}
			</div>
		</div>
	);
};
 
export default Home;