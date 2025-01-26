import { ElementRef, FormEvent, useEffect, useRef, useState } from "react";
import { AmountSettingsObject, SettingsObject, TestType, TimedSettingsObject, getTestTypeName } from "../../SettingsDef";
import Timer from "../Timer/Timer";
import { Box, Button, FormControl, FormLabel } from "@mui/material";
import Field, { FieldType } from "../Field/Field";
import { FormInfo, VerbInfo } from "jv-conjugator";
import { FullFormInfo, convertToFullFormInfo, getQuestionStringForm, getQuestionStringVerb } from "../../Utils/VerbFormsInfo";
import useMeasure from "react-use-measure";
import { ErrorCode } from "../../ErrorCodes";
import { ROOT_ENDPOINT } from "../../Connection/settings";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { setTestState } from "../../Redux/Test/testActions";
import { InTestState } from "../../Redux/Test/testReducer";

type QuestionAnswer = {kana: string, kanji?: string};

type QuestionInfo = {
	questionNumber: number,
	verbFormInfo: FullFormInfo,
	verbInfo: VerbInfo,
	answers: QuestionAnswer[]
}

const TestForm = () => {
	const dispatch = useDispatch();
	const settings: SettingsObject = useSelector((state: RootState) => state.settings.currentSettings);
	const userId: number = useSelector((state: RootState) => state.settings.userId);

	const [testFinished, setTestFinished] = useState<boolean>(false);
	const [questionNumber, setQuestionNumber] = useState<number>(1);
	const [questionInfo, setQuestionInfo] = useState<QuestionInfo>();
	const [nextQuestionInfo, setNextQuestionInfo] = useState<QuestionInfo>();
	const [questionLoaded, setQuestionLoaded] = useState<boolean>(false);
	const [nextQuestionLoaded, setNextQuestionLoaded] = useState<boolean>(false);
	const [answeredCorrectlyTotal, setAnsweredCorrectlyTotal] = useState<number>(0);
	const [showAnswerResult, setShowAnswerResult] = useState<boolean>(false);
	const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean>(true);
	const [errorOccurred, setErrorOccured] = useState<string>("");

	const [formRef, { width }] = useMeasure();

	const shouldCondenseQuestionNumbers = () => {
		if (settings.testType === TestType.Timed) {
			return width < 400;
		}
		
		return false;
	};

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
		try {
			restartTest();
		} catch (e) {
			return;
		}
	}, []);

	useEffect(() => {
		if (nextQuestionLoaded) {
			if (!questionLoaded) {
				// The next question finished fetching while we were already waiting to load it so load it immediately
				loadNextQuestion(questionNumber);
			}
		}
	}, [nextQuestionLoaded]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (testFinished) {
			// Pressed restart button
			restartTest();
			return;
		}

		if (showAnswerResult) {
			// Pressed next from answer result step

			if (!checkIfTestShouldContinue(questionNumber)) {
				finishTest();
				return;
			}

			const newQuestionNumber = questionNumber + 1;
			setQuestionNumber(newQuestionNumber);
			setAnswerInputVal("");
			setShowAnswerResult(false);

			if (nextQuestionLoaded)
			{
				// Next question has already finished fetching so load it now
				loadNextQuestion(newQuestionNumber);
			} else {
				// Still waiting for the next question to finish fetching so display loading state
				setQuestionLoaded(false);
			}

			return;
		}

		// Pressed check from answering step
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
	};

	const checkIfTestShouldContinue = (number: number):boolean =>  {
		if (settings.testType === TestType.Amount && number >= (settings.testTypeObject as AmountSettingsObject).amount) {
			return false;
		}

		return true;
	};

	const loadNextQuestion = (number: number) => {
		// Called when the question has finished fetching and we are ready to display it
		setQuestionInfo(nextQuestionInfo);
		setQuestionLoaded(true);

		setFocusOnAnswerInput();

		try {
			// Preemptively load the next question
			if (checkIfTestShouldContinue(number)) {
				getQuestionData(number + 1);
			}
		} catch (e) {
			throw new Error((e as Error).message);
		}
	};

	const setFocusOnAnswerInput = () => {
		setTimeout(() => {
			// Wait slightly as it may not be defined immediately
			answerInputRef.current?.giveFocus();
		}, 10);
	};

	const finishTest = () => {
		setTestFinished(true);

		setTimeout(() => {
			// Wait slightly as it may not be defined immediately
			restartButtonRef.current?.focus();
		}, 10);
	};

	const getQuestionData = (number: number) => {
		const firstQuestion: boolean = number === 1;

		if (firstQuestion) {
			setQuestionLoaded(false);
		}

		setNextQuestionLoaded(false);
		
		const endpoint = ROOT_ENDPOINT + "/question/" + userId;
		fetch(endpoint)
			.then((response: Response) => {
				if (response.status === 200) {
					return response.json();
				}
				throw new Error(response.status.toString());
			})
			.then((data) => {
				const verbInfo: VerbInfo = data.verbInfo;
				const formInfo: FormInfo = data.formInfo;
				const answers: QuestionAnswer[] = data.answers;

				setQuestionData(number, verbInfo, formInfo, answers);
			})
			.catch((err) => {
				console.log(err);
				setErrorOccured(ErrorCode.FetchQuestionFailed);
			});
	};

	const setQuestionData = (number: number, verbInfo: VerbInfo, formInfo: FormInfo, answers: QuestionAnswer[]) => {
		const firstQuestion = number === 1;
		
		const fullFormInfo: FullFormInfo = convertToFullFormInfo(formInfo);

		if (firstQuestion) {
			setQuestionInfo({
				questionNumber: number,
				verbFormInfo: fullFormInfo,
				verbInfo: verbInfo,
				answers: answers
			});

			// First question is ready to display now
			setQuestionLoaded(true);
			setFocusOnAnswerInput();

			// Preemptively start loading the next question
			if (checkIfTestShouldContinue(number))
			{
				getQuestionData(number + 1);
			}
		} else {
			setNextQuestionInfo({
				questionNumber: number,
				verbFormInfo: fullFormInfo,
				verbInfo: verbInfo,
				answers: answers
			});
			setNextQuestionLoaded(true);
		}
	};

	const checkAnswerIsCorrect = (answer: string):boolean => {
		if (!questionInfo) return false;

		for(let i = 0; i < questionInfo?.answers.length; i++) {
			const correctAnswer = questionInfo?.answers[i];

			if (answer === correctAnswer.kana) {
				return true;
			}
			if (correctAnswer.kanji && answer === correctAnswer.kanji) {
				return true;
			}
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
			getQuestionData(1);
		} catch (e) {
			throw new Error((e as Error).message);
		}
	};

	const quitTest = () => {
		dispatch(setTestState(InTestState.False));	
	};

	const setAnswerInput = (newAnswerInput: string, valid: boolean) => {
		setAnswerInputVal(newAnswerInput);
		setFieldData({...fieldData, answerInput: {...fieldData.answerInput, valid: valid}});
	};

	const getTotalQuestions = (): string => {
		if (settings.testType === TestType.Amount) {
			return String((settings.testTypeObject as AmountSettingsObject).amount);
		}

		return "∞";
	};

	const getQuestionLineSpacing = (): string => {
		if (width < 460) return "0px";

		return (460-width)/4 + "px";
	};

	const renderQuestionInfo = () => {
		return (
			<div>
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
							<p>Correct answer: {((questionInfo?.answers[0].kanji)? questionInfo.answers[0].kanji + " / " : "") + questionInfo?.answers[0].kana}</p>
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
			</div>
		);
	};

	return (
		<Box sx={{ p: 1, border: "1px solid black", borderRadius: 2 }}>
			<form className="form test-form" onSubmit={ handleSubmit } ref={ formRef }>
				<FormControl component="fieldset" variant="standard" className="test-form-fieldset">
					<FormLabel component="legend" className="form-title">{ getTestTypeName(settings.testType) }</FormLabel>
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
								<p>Total Correct: { answeredCorrectlyTotal + ((settings.testType === TestType.Amount)? ("/" + getTotalQuestions()) : "") }</p>
							</div>
							<div className="form-button-row">
								<Button variant="outlined" type="button" className="button-primary" onClick={ quitTest }>Quit</Button>
								<Button variant="contained" color="darkBlue" type="submit" className="button-primary" ref={ restartButtonRef }>Restart</Button>
							</div>
						</div>}
						{!testFinished && <div>
							<span className="question-numbers-line">
								<span style={{width: getQuestionLineSpacing()}}></span>
								{shouldCondenseQuestionNumbers() && <span>
									<p>Question:</p>
									<p>{questionNumber}/{getTotalQuestions()}</p>
								</span>}
								{!shouldCondenseQuestionNumbers() && <span>
									<p>Question: {questionNumber}/{getTotalQuestions()}</p>
								</span>}
								{settings.testType === TestType.Timed &&
									<Timer startingTime={ (settings.testTypeObject as TimedSettingsObject).time } runTimer={ questionLoaded && !showAnswerResult} timeUpFunction={ finishTest }></Timer>
								}
								{shouldCondenseQuestionNumbers() && <span>
									<p>Correct:</p>
									<p>{ answeredCorrectlyTotal }</p>
								</span>}
								{!shouldCondenseQuestionNumbers() && <span>
									<p>Correct: { answeredCorrectlyTotal }</p>
								</span>}
								<span style={{width: getQuestionLineSpacing()}}></span>
							</span>
							<div className="line-break"></div>
							{questionLoaded && renderQuestionInfo()}
							{!questionLoaded && <p className="status-text">Loading...</p>}
							<div className="line-break-large"></div>
							<div className="form-button-row">
								<Button variant="outlined" type="button" className="button-primary" onClick={ quitTest }>Quit</Button>
								{showAnswerResult && <Button variant="contained" color="darkBlue" type="submit" className="button-primary" ref={ nextButtonRef }>Next</Button>}
								{!showAnswerResult && <span>
									{questionLoaded && <Button variant="contained" color="darkBlue" type="submit" className="button-primary" ref={ nextButtonRef }>Check</Button>}
									{!questionLoaded && <Button variant="contained" color="darkBlue" type="submit" className="button-primary" disabled ref={ nextButtonRef }>Check</Button>}
								</span>}
							</div>
						</div>}
					</div>}
				</FormControl>
			</form>
		</Box>
	);
};
 
export default TestForm;