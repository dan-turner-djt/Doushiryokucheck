import { ChangeEvent, FormEvent, useState } from "react";
import { AmountSettingsObject, SettingsObject, TestType, TimedSettingsObject, getTestTypeName } from "../../SettingsDef";
import Timer from "../Timer/Timer";

export type TestFormProps = {
  testSettings: SettingsObject;
  quitHandler: () => void;
}

const TestForm = (props: TestFormProps) => {
  const [testFinished, setTestFinished] = useState<boolean>(false);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [answeredCorrectlyTotal, setAnsweredCorrectlyTotal] = useState<number>(0);
  const [answerInput, setAnswerInput] = useState<string>("");
  const [showAnswerResult, setShowAnswerResult] = useState<boolean>(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean>(true);

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
      if (checkAnswerIsCorrect(answerInput)) {
        setAnsweredCorrectly(true);
        setAnsweredCorrectlyTotal(answeredCorrectlyTotal + 1);
      } else {
        setAnsweredCorrectly(false);
      }

      setShowAnswerResult(true);
    }
  }

  const checkIfTestShouldContinue = ():boolean =>  {
    if (props.testSettings.testType === TestType.Amount && questionNumber + 1 >= (props.testSettings.testTypeObject as AmountSettingsObject).amount) {
        return false;
    }

    return true;
  }

  const loadNextQuestion = () => {
    setQuestionNumber(questionNumber + 1);
    setAnswerInput("");
  }

  const finishTest = () => {
    setTestFinished(true);
  }

  const checkAnswerIsCorrect = (answer: string):boolean => {
    if (answer !== "") {
      return false;
    }
    return true;
  }

  const restartTest = () => {
    setAnswerInput("");
    setQuestionNumber(0);
    setAnsweredCorrectlyTotal(0);
    setShowAnswerResult(false);
    setTestFinished(false);
  }

  const quitTest = () => {
    props.quitHandler();
  }

  const handleAnswerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswerInput(e.target.value);
  }

  return (
    <form className="form test-form" onSubmit={ handleSubmit }>
      <fieldset>
        <legend>{ getTestTypeName(props.testSettings.testType) }</legend>
        {testFinished && <div>
          <p>Total Correct: { answeredCorrectlyTotal }</p>
          <div className="form-button-row">
            <button type="submit" className="button-primary">Restart</button>
            <button type="button" className="button-primary" onClick={ quitTest }>Quit</button>
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
          <input value={ answerInput } onChange={ handleAnswerInputChange }></input>
          <div className="form-button-row">
            <button type="submit" className="button-primary">{ showAnswerResult? "Next" : "Check"}</button>
            <button type="button" className="button-primary" onClick={ quitTest }>Quit</button>
          </div>
        </div>}
      </fieldset>
    </form>
  );
}
 
export default TestForm;