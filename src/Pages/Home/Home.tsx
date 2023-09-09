import { useEffect, useState } from "react";
import SettingsForm from "../../Components/SettingsForm/SettingsForm";
import TestForm from "../../Components/TestForm/TestForm";
import { DefaultSettings, SettingsObject } from "../../SettingsDef";
import { convertFiles } from "../../VerbFileConversion/Convert";
import { VerbFormsInfo, convertVerbFormsInfo } from "../../Utils/VerbFormsInfo";
import { getFullVerbList, getVerbLevelsArray } from "../../Utils/VerbInfo";
import { VerbInfo } from "jv-conjugator";

const enum InTestState {
	True, False, Loading
}

const Home = () => {

	const [inTest, setInTest] = useState<InTestState>(InTestState.False);
	const [currentSettings, setCurrentSettings] = useState<SettingsObject>(DefaultSettings);
	const [verbFormsInfo, setVerbFormsInfo] = useState<VerbFormsInfo>([]);
	const [verbLevelsInfo, setVerbLevelsInfo] = useState<string[]>([]);
	const [fullVerbList, setFullVerbList] = useState<VerbInfo[]>([]);
	const [errorOcurred, setErrorOccurred] = useState<string>("");

	useEffect(() => {
		if(inTest === InTestState.False) {
			return;
		}
		setVerbFormsInfo(convertVerbFormsInfo(currentSettings.verbForms));
		setVerbLevelsInfo(getVerbLevelsArray(currentSettings));

		try {
			getFullVerbList(currentSettings)
				.then((res: VerbInfo[]) => {
					console.log(res);
					setFullVerbList(res);
					setInTest(InTestState.True);
				});
		} catch (e) {
			setErrorOccurred((e as Error).message);
			setInTest(InTestState.True);
		}
	}, [currentSettings]);

	const handleSubmitSettingsForm = (newSettings: SettingsObject) => {
		setInTest(InTestState.Loading);
		setCurrentSettings(newSettings);
	};

	const quitTest = () => {
		setInTest(InTestState.False);
		setErrorOccurred("");
		setCurrentSettings(DefaultSettings);
	};

	const handleConvertFiles = () => {
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
          <TestForm testSettings={ currentSettings } inTest={ true } verbFormsInfo={ verbFormsInfo } verbLevelsInfo={ verbLevelsInfo } fullVerbList={ fullVerbList } errorOcurred={ errorOcurred } quitHandler={ quitTest }/>
				}
				{(inTest !== InTestState.True) && 
          <SettingsForm initialSettings={currentSettings} submitHandler={ handleSubmitSettingsForm }></SettingsForm>
				}
			</div>
		</div>
	);
};
 
export default Home;