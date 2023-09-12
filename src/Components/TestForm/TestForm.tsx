import { ElementRef, FormEvent, useEffect, useRef, useState } from "react";
import { AmountSettingsObject, SettingsObject, TestType, TimedSettingsObject, getTestTypeName } from "../../SettingsDef";
import Timer from "../Timer/Timer";
import { Box, Button, FormControl, FormLabel } from "@mui/material";
import Field, { FieldType } from "../Field/Field";
import { FormInfo, VerbInfo } from "jv-conjugator";
import { VerbFormsInfo, getQuestionStringForm, getQuestionStringVerb } from "../../Utils/VerbFormsInfo";
import { getConjugation } from "../../Utils/GetConjugation";

export type TestFormProps = {
  testSettings: SettingsObject,
	inTest: boolean,
	verbFormsInfo: VerbFormsInfo,
	verbLevelsInfo: string[],
	fullVerbList: VerbInfo[],
	errorOcurred: string, // An error may occur when trying to process the settings, so start the test in error state if so
  quitHandler: () => void
}

type QuestionInfo = {
	questionNumber: number,
	verbFormInfo: {displayName: string, auxDisplayName?: string, info: FormInfo},
	verbInfo: VerbInfo,
	answer: {kana: string, kanji?: string}
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
			ref: answerInputRef
		}
	});
	const [answerInputVal, setAnswerInputVal] = useState<string>(fieldData.answerInput.staticData.startingValue);

	const nextButtonRef = useRef<ElementRef<typeof Button>>(null);
	const restartButtonRef = useRef<ElementRef<typeof Button>>(null);

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

			setTimeout(() => {
				// Wait slightly as it may not be defined immediately
				nextButtonRef.current?.focus();
			}, 10);
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

		setTimeout(() => {
			// Wait slightly as it may not be defined immediately
			restartButtonRef.current?.focus();
		}, 10);
	};

	const getAndSetQuestionData = (number: number) => {
		const randomVerbFormInfo = props.verbFormsInfo[Math.floor(Math.random() * props.verbFormsInfo.length)];

		const fullVerbList: VerbInfo[] = props.fullVerbList;
		const randomVerbInfo: VerbInfo =  fullVerbList[Math.floor(Math.random() * fullVerbList.length)];
		
		let questionAnswer: {kana: string, kanji?: string};
		try {
			console.log(randomVerbInfo);
			console.log(randomVerbFormInfo);
			questionAnswer = getConjugation(randomVerbInfo, randomVerbFormInfo.info);
		}
		catch (e) {
			setErrorOccured((e as Error).message);
			throw new Error;
		}

		setQuestionInfo({
			questionNumber: number,
			verbFormInfo: randomVerbFormInfo,
			verbInfo: randomVerbInfo,
			answer: questionAnswer
		});

		setTimeout(() => {
			// Wait slightly as it may not be defined immediately
			answerInputRef.current?.giveFocus();
		}, 10);
	};

	const checkAnswerIsCorrect = (answer: string):boolean => {
		if (answer === questionInfo?.answer.kana) {
			return true;
		}
		if (questionInfo?.answer.kanji && answer === questionInfo.answer.kanji) {
			return true;
		}
		return false;
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

	const getTotalQuestions = (): string => {
		if (props.testSettings.testType === TestType.Amount) {
			return String((props.testSettings.testTypeObject as AmountSettingsObject).amount);
		}

		return "∞";
	};

	return (
		<Box sx={{ p: 2, border: "1px solid black", borderRadius: 2 }}>
			<form className="form test-form" onSubmit={ handleSubmit }>
				<FormControl component="fieldset" variant="standard" className="test-form-fieldset">
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
							<div className="fixed-size-area">
								<div className="line-break-large"></div>
								<p>Total Correct: { answeredCorrectlyTotal + ((props.testSettings.testType === TestType.Amount)? (" / " + getTotalQuestions()) : "") }</p>
							</div>
							<div className="form-button-row">
								<Button variant="outlined" type="button" className="button-primary" onClick={ quitTest }>Quit</Button>
								<Button variant="contained" color="darkBlue" type="submit" className="button-primary" ref={ restartButtonRef }>Restart</Button>
							</div>
						</div>}
						{!testFinished && <div>
							<span className="question-numbers-line">
								<span>
									<p>Question: {questionInfo?.questionNumber} / {getTotalQuestions()}</p>
								</span>
								{props.testSettings.testType === TestType.Timed &&
									<Timer startingTime={ (props.testSettings.testTypeObject as TimedSettingsObject).time } timeUpFunction={ finishTest }></Timer>
								}
								<span>
									<p>Total Correct: { answeredCorrectlyTotal }</p>
								</span>
							</span>
							<div className="line-break-large"></div>
							<div className="question-section">
								<p>{ getQuestionStringVerb(questionInfo?.verbInfo) }</p>
								<p>{ getQuestionStringForm(questionInfo?.verbFormInfo) }</p>
							</div>
							<div className="line-break"></div>
							<div className="fixed-size-area">
								{showAnswerResult && <div>
									{answeredCorrectly && <div>
										<div className="correct-answer">
											<p>Correct!</p>
										</div>
										<div className="line-break"></div>
									</div>}
									{!answeredCorrectly && <div>
										<div className="incorrect-answer">
											<p>Incorrect!</p>
										</div>
										<div className="line-break-large"></div>
										<p>Correct answer: {((questionInfo?.answer.kanji)? questionInfo.answer.kanji + " / " : "") + questionInfo?.answer.kana}</p>
										<div className="line-break-small"></div>
										<div className="your-answer">
											<p>Your answer: {answerInputVal}</p>
										</div>
									</div>}
								</div>}
								{!showAnswerResult && 
									<Field type={ FieldType.String }
										ref={ answerInputRef }
										staticData={ fieldData.answerInput.staticData }
										valueSetter={ setAnswerInput }
									/>
								}
							</div>
							<div className="form-button-row">
								<Button variant="outlined" type="button" className="button-primary" onClick={ quitTest }>Quit</Button>
								<Button variant="contained" color="darkBlue" type="submit" className="button-primary" ref={ nextButtonRef }>{ showAnswerResult? "Next" : "Check"}</Button>
							</div>
						</div>}
					</div>}
				</FormControl>
			</form>
		</Box>
	);
};
 
export default TestForm;