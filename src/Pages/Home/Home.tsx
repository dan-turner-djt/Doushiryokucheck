import SettingsForm from "../../Components/SettingsForm/SettingsForm";
import TestForm from "../../Components/TestForm/TestForm";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { InTestState } from "../../Redux/Test/testReducer";

const Home = () => {
	const testState: number = useSelector((state: RootState) => state.test.testState);

	return (
		<div className="home">
			{(testState !== InTestState.True) &&
				<h2 className="page-title">Japanese Verb Conjugation Tester</h2>
			}
			{(testState !== InTestState.True) && <div className="content">
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
				{(testState === InTestState.True) &&
					<TestForm/>
				}
				{(testState === InTestState.False) &&
					<SettingsForm/>
				}
				{(testState === InTestState.Loading) &&
					<p className="status-text">Loading test...</p>
				}
				{(testState === InTestState.Error) &&
					<p className="status-text">An error occured, please refresh the page and try again</p>
				}
			</div>
		</div>
	);
};
 
export default Home;