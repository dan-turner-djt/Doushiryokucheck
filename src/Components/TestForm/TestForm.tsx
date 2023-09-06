import { ElementRef, FormEvent, useEffect, useRef, useState } from "react";
import { AmountSettingsObject, SettingsObject, TestType, TimedSettingsObject, getTestTypeName } from "../../SettingsDef";
import Timer from "../Timer/Timer";
import { Box, Button, FormControl, FormLabel } from "@mui/material";
import Field, { FieldType } from "../Field/Field";
import { FormInfo, VerbInfo } from "jv-conjugator";
import { VerbFormsInfo, getQuestionString } from "../../Utils/VerbFormsInfo";
import { FullVerbListInfo } from "../../Verb/VerbInfoDefs";
import { ErrorCode } from "../../ErrorCodes";

export type TestFormProps = {
  testSettings: SettingsObject,
	inTest: boolean,
	verbFormsInfo: VerbFormsInfo,
	verbLevelsInfo: string[],
	fullVerbList: FullVerbListInfo,
	errorOcurred: string, // An error may occur when trying to process the settings, so start the test in error state if so
  quitHandler: () => void
}

type QuestionInfo = {
	questionNumber: number,
	verbFormInfo: {displayName: string, info: FormInfo},
	verbInfo: VerbInfo
}

const TestForm = (props: TestFormProps) => {
	const [testFinished, setTestFinished] = useState<boolean>(false);
	const [questionNumber, setQuestionNumber] = useState<number>(1);
	const [questionInfo, setQuestionInfo] = useState<QuestionInfo>();
	const [answeredCorrectlyTotal, setAnsweredCorrectlyTotal] = useState<number>(0);
	const [showAnswerResult, setShowAnswerResult] = useState<boolean>(false);
	const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean>(true);
	const [errorOccurred, setErrorOccured] = useState<string>(props.errorOcurred);

	const answerInputRef = useRef<ElementRef<typeof Field>>(null);
	const [fieldData, setFieldData] = useState({
		answerInput: {
			staticData: {
				required: true,
				label: "Answer",
				startingValue: ""
			},
			valid: true,
			focus: false,
			ref: answerInputRef
		}
	});
	const [answerInputVal, setAnswerInputVal] = useState<string>(fieldData.answerInput.staticData.startingValue);

	useEffect(() => {
		// When first loading the test form
		try {
			restartTest();
		} catch (e) {
			return;
		}
	}, [props.inTest]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (testFinished) {
			// Pressed restart button
			try {
				restartTest();
			} catch (e) {
				return;
			}
			return;
		}

		if (showAnswerResult) {
			// Pressed next from incorrect step
			setShowAnswerResult(false);

			if (!checkIfTestShouldContinue()) {
				finishTest();
				return;
			}
  
			try {
				loadNextQuestion();
			}
			catch (e) {
				return;
			}
		} else {
			// Pressed check from answer step
			if (checkAnswerIsCorrect(answerInputVal)) {
				setAnsweredCorrectly(true);
				setAnsweredCorrectlyTotal(answeredCorrectlyTotal + 1);
			} else {
				setAnsweredCorrectly(false);
			}

			setShowAnswerResult(true);
		}
	};

	const checkIfTestShouldContinue = ():boolean =>  {
		if (props.testSettings.testType === TestType.Amount && questionNumber >= (props.testSettings.testTypeObject as AmountSettingsObject).amount) {
			return false;
		}

		return true;
	};

	const loadNextQuestion = () => {
		setQuestionNumber(questionNumber + 1);
		setAnswerInputVal("");

		try {
			getAndSetQuestionData(questionNumber + 1);
		} catch (e) {
			throw new Error;
		}
	};

	const finishTest = () => {
		setTestFinished(true);
	};

	const getAndSetQuestionData = (number: number) => {
		const randomVerbFormInfo = props.verbFormsInfo[Math.floor(Math.random() * props.verbFormsInfo.length)];

		type level = "N5" | "N4" | "N3" | "N2" | "N1";
		const randomVerbLevel = props.verbLevelsInfo[Math.floor(Math.random() * props.verbLevelsInfo.length)];
		const verbInfoForLevel: VerbInfo[] | undefined = props.fullVerbList[randomVerbLevel as level];
		if (verbInfoForLevel === undefined) {
			setErrorOccured(ErrorCode.VerbListUndefined);
			throw new Error;
		}

		const randomVerbInfo: VerbInfo =  verbInfoForLevel[Math.floor(Math.random() * verbInfoForLevel.length)];

		setQuestionInfo({
			questionNumber: number,
			verbFormInfo: randomVerbFormInfo,
			verbInfo: randomVerbInfo
		});
	};

	const checkAnswerIsCorrect = (answer: string):boolean => {
		if (answer !== "o") {
			return false;
		}
		return true;
	};

	const restartTest = () => {
		setAnswerInputVal("");
		setQuestionNumber(1);
		setAnsweredCorrectlyTotal(0);
		setShowAnswerResult(false);
		setTestFinished(false);

		try {
			getAndSetQuestionData(1);
		} catch (e) {
			throw new Error;
		}
	};

	const quitTest = () => {
		props.quitHandler();
	};

	const setAnswerInput = (newAnswerInput: string, valid: boolean) => {
		setAnswerInputVal(newAnswerInput);
		setFieldData({...fieldData, answerInput: {...fieldData.answerInput, valid: valid}});
	};

	return (
		<Box sx={{ p: 2, border: "1px solid black", borderRadius: 2 }}>
			<form className="form test-form" onSubmit={ handleSubmit }>
				<FormControl component="fieldset" variant="standard">
					<FormLabel component="legend" className="form-title">{ getTestTypeName(props.testSettings.testType) }</FormLabel>
					{errorOccurred !== "" && <div>
						<p>Sorry, an error has occurred</p>
						<p>Error Code: {errorOccurred}</p>
						<div className="form-button-row">
							<Button variant="outlined" type="button" className="button-primary" onClick={ quitTest }>Quit</Button>
						</div>
					</div>}
					{errorOccurred === "" && <div>
						{testFinished && <div>
							<p>Total Correct: { answeredCorrectlyTotal }</p>
							<div className="form-button-row">
								<Button variant="outlined" type="button" className="button-primary" onClick={ quitTest }>Quit</Button>
								<Button variant="contained" color="darkBlue" type="submit" className="button-primary">Restart</Button>
							</div>
						</div>}
						{!testFinished && <div>
							<span>
								<p>Correct: { answeredCorrectlyTotal }</p>
								{props.testSettings.testType === TestType.Timed &&
									<Timer startingTime={ (props.testSettings.testTypeObject as TimedSettingsObject).time } timeUpFunction={ finishTest }></Timer>
								}
							</span>
							<p>Question {questionInfo?.questionNumber + ": " + getQuestionString(questionInfo?.verbFormInfo)}</p>
							{showAnswerResult && <div>
								{answeredCorrectly && <p>
									Correct!
								</p>}
								{!answeredCorrectly && <p>
									Incorrect! Correct answer is ...
								</p>}
							</div>}
							{!showAnswerResult && 
								<Field type={ FieldType.String }
									ref={ answerInputRef }
									staticData={ fieldData.answerInput.staticData }
									focus={ fieldData.answerInput.focus }
									valueSetter={ setAnswerInput }
								/>
							}
							<div className="form-button-row">
								<Button variant="outlined" type="button" className="button-primary" onClick={ quitTest }>Quit</Button>
								<Button variant="contained" color="darkBlue" type="submit" className="button-primary">{ showAnswerResult? "Next" : "Check"}</Button>
							</div>
						</div>}
					</div>}
				</FormControl>
			</form>
		</Box>
	);
};
 
export default TestForm;