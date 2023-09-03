import { ChangeEvent, ElementRef, FormEvent, useRef, useState } from "react";
import { AmountSettingsObject, SettingsObject, TestType, TimedSettingsObject, getTestTypeName } from "../../SettingsDef";
import Timer from "../Timer/Timer";
import { Box, Button, FormControl } from "@mui/material";
import Field, { FieldType } from "../Field/Field";

export type TestFormProps = {
  testSettings: SettingsObject;
  quitHandler: () => void;
}

const TestForm = (props: TestFormProps) => {
	const [testFinished, setTestFinished] = useState<boolean>(false);
	const [questionNumber, setQuestionNumber] = useState<number>(0);
	const [answeredCorrectlyTotal, setAnsweredCorrectlyTotal] = useState<number>(0);
	const [showAnswerResult, setShowAnswerResult] = useState<boolean>(false);
	const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean>(true);

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

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (testFinished) {
			// Pressed restart button
			restartTest();
			return;
		}

		if (showAnswerResult) {
			// Pressed next from incorrect step
			setShowAnswerResult(false);

			if (!checkIfTestShouldContinue()) {
				finishTest();
				return;
			}
  
			loadNextQuestion();
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
		if (props.testSettings.testType === TestType.Amount && questionNumber + 1 >= (props.testSettings.testTypeObject as AmountSettingsObject).amount) {
			return false;
		}

		return true;
	};

	const loadNextQuestion = () => {
		setQuestionNumber(questionNumber + 1);
		setAnswerInputVal("");
	};

	const finishTest = () => {
		setTestFinished(true);
	};

	const checkAnswerIsCorrect = (answer: string):boolean => {
		if (answer !== "o") {
			return false;
		}
		return true;
	};

	const restartTest = () => {
		setAnswerInputVal("");
		setQuestionNumber(0);
		setAnsweredCorrectlyTotal(0);
		setShowAnswerResult(false);
		setTestFinished(false);
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
				<FormControl>
					<fieldset>
						<legend>{ getTestTypeName(props.testSettings.testType) }</legend>
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
							<p>Question {questionNumber + 1}:</p>
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
					</fieldset>
				</FormControl>
			</form>
		</Box>
	);
};
 
export default TestForm;