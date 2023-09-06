import { useEffect, useState } from "react";
import SettingsForm from "../../Components/SettingsForm/SettingsForm";
import TestForm from "../../Components/TestForm/TestForm";
import { DefaultSettings, SettingsObject } from "../../SettingsDef";
import { convertFiles } from "../../VerbFileConversion/Convert";
import { VerbFormsInfo, convertVerbFormsInfo } from "../../Utils/VerbFormsInfo";
import { getVerbLevelsArray } from "../../Utils/VerbInfo";

const enum InTestState {
	True, False, Loading
} 

const Home = () => {

	const [inTest, setInTest] = useState<InTestState>(InTestState.False);
	const [currentSettings, setCurrentSettings] = useState<SettingsObject>(DefaultSettings);
	const [verbFormsInfo, setVerbFormsInfo] = useState<VerbFormsInfo>([]);
	const [verbLevelsInfo, setVerbLevelsInfo] = useState<string[]>([]);
	const [errorOcurred, setErrorOccurred] = useState<string>("");

	useEffect(() => {
		if(inTest === InTestState.False) {
			return;
		}
		setVerbFormsInfo(convertVerbFormsInfo(currentSettings.verbForms));
		setVerbLevelsInfo(getVerbLevelsArray(currentSettings));

		setInTest(InTestState.True);
		
	}, [currentSettings]);

	const handleSubmitSettingsForm = (newSettings: SettingsObject) => {
		setInTest(InTestState.Loading);
		setCurrentSettings(newSettings);
		//getVerbList(newSettings);
	};

	const quitTest = () => {
		setInTest(InTestState.False);
		setErrorOccurred("");
	};

	const handleConvertFiles = (e: any) => {
		convertFiles();
	};

	return (
		<div className="home">
			<h2 className="page-title">Japanese Verb Conjugation Tester</h2>
			<div className="content">
				<p>Welcome!</p>
				<button type="button" onClick={handleConvertFiles}>Convert files</button>
			</div>
			<div>
				{(inTest === InTestState.True) && 
          <TestForm testSettings={ currentSettings } inTest={ true } verbFormsInfo={ verbFormsInfo } verbLevelsInfo={ verbLevelsInfo } errorOcurred={ errorOcurred } quitHandler={ quitTest }/>
				}
				{(inTest !== InTestState.True) && 
          <SettingsForm initialSettings={currentSettings} submitHandler={ handleSubmitSettingsForm }></SettingsForm>
				}
			</div>
		</div>
	);
};
 
export default Home;