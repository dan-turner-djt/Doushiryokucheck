import { useEffect, useState } from "react";
import SettingsForm from "../../Components/SettingsForm/SettingsForm";
import TestForm from "../../Components/TestForm/TestForm";
import { DefaultSettings, SettingsObject } from "../../SettingsDef";
import { ROOT_ENDPOINT } from "../../Connection/settings";

const enum InTestState {
	True, False, Loading
}

const Home = () => {
	const [userId, setUserId] = useState<number>(Math.floor(Math.random() * 1000000000000000));
	const [inTest, setInTest] = useState<InTestState>(InTestState.False);
	const [currentSettings, setCurrentSettings] = useState<SettingsObject>(DefaultSettings);
	const [errorOcurred, setErrorOccurred] = useState<boolean>(false);

	useEffect(() => {
		if(inTest === InTestState.False) {
			return;
		}

		setErrorOccurred(false);

		try {
			const content = {settings: currentSettings};

			const endpoint = ROOT_ENDPOINT + "/settings/" + userId;
			fetch(endpoint, {
				method: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(content)
			})
				.then((response: Response) => {
					if (response.status !== 200) {
						throw new Error(response.status.toString());
					}

					setInTest(InTestState.True);
				})
				.catch((err) => {
					console.log(err);
					setErrorOccurred(true);
				});
		} catch (e) {
			setErrorOccurred(true);
		}
	}, [currentSettings]);

	const handleSubmitSettingsForm = (newSettings: SettingsObject) => {
		setInTest(InTestState.Loading);
		setCurrentSettings(newSettings);
	};

	const quitTest = () => {
		setInTest(InTestState.False);
		setCurrentSettings(DefaultSettings);
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
				<p>Answers are accepted in both hiragana and the corresponding kanji, as well as common colloquial shortenings for certain forms.</p>
				<div className="line-break"></div>
				<p>Selected additional forms are combined with selected basic forms. It is possible to create unnatural yet grammatically correct combinations depending on the options selected.</p>
			</div>}
			<div className="form-container">
				{(inTest === InTestState.True) && 
          <TestForm testSettings={ currentSettings } userId={ userId } inTest={ true } quitHandler={ quitTest }/>
				}
				{(inTest !== InTestState.True) && 
          <SettingsForm initialSettings={currentSettings} submitHandler={ handleSubmitSettingsForm }></SettingsForm>
				}
			</div>
			{errorOcurred && <p className="status-text">An error occured, please try again with different settings</p>}
		</div>
	);
};
 
export default Home;