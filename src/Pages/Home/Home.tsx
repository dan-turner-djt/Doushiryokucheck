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
		setVerbFormsInfo(convertVerbFormsInfo(currentSettings.verbForms, currentSettings.auxForms, currentSettings.exclusiveAux));
		setVerbLevelsInfo(getVerbLevelsArray(currentSettings));

		try {
			getFullVerbList(currentSettings)
				.then((res: VerbInfo[]) => {
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
			{(inTest !== InTestState.True) &&
				<h2 className="page-title">Japanese Verb Conjugation Tester</h2>
			}
			{(inTest !== InTestState.True) && <div className="content">
				<p>Welcome!</p>
				<div className="line-break"></div>
				<p>動詞力チェック / Doushiryoku Check is a Japanese verb conjugation testing tool to help Japanese learners test or improve their verb conjugation abilities.</p>
				<div className="line-break"></div>
				<p>Users can choose from three test modes and an array of conjugation options, and can be tested using verbs from any chosen JLPT level.</p>
				<p>Answers are accepted in both hiragana and the corresponding kanji, as well as common colloquial shortenings for certain forms. Selected additional forms are combined with selected basic forms.</p>
				{/*<button type="button" onClick={handleConvertFiles}>Convert files</button>*/}
			</div>}
			<div className="form-container">
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