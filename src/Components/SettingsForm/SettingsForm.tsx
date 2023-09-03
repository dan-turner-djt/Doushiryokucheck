import { ElementRef, FormEvent, RefObject, useRef, useState } from "react";
import { DefaultSettings, SettingsObject, TestType, getTestTypeDefaultSettings, getTestTypeName, DefaultAmountSettings, DefaultTimedSettings } from "../../SettingsDef";
import Field, { FieldRef, FieldType, StaticFieldData } from "../Field/Field";
import { Box, Button, FormControl, MenuItem, TextField } from "@mui/material";

export type SettingsFormProps = {
  initialSettings: SettingsObject;
  submitHandler: (newSettings: SettingsObject) => void;
}

const SettingsForm = (props: SettingsFormProps) => {
	const [currentSettings, setCurrentSettings] = useState<SettingsObject>(props.initialSettings);
  
	const wordAmountRef = useRef<ElementRef<typeof Field>>(null);
	const timeLimitRef = useRef<ElementRef<typeof Field>>(null);
	const [fieldData, setFieldData] = useState({
		wordAmount: {
			staticData: {
				required: true,
				label: "Word Amount",
				minimum: 1, maximum: 100,
				startingValue: DefaultAmountSettings.amount
			},
			valid: true,
			focus: false,
			ref: wordAmountRef
		},
		timeLimit: {
			staticData: {
				required: true,
				label: "Time Limit (seconds)",
				minimum: 1, maximum: 3600,
				startingValue: DefaultTimedSettings.time
			}, 
			valid: true, 
			focus: false,
			ref: timeLimitRef
		}
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const firstInvalidField: RefObject<FieldRef> | undefined = getFirstInvalidField();
		if (!firstInvalidField) {
			// Form is valid, submit
			props.submitHandler(currentSettings);
		} else {
			if (firstInvalidField.current) {
				firstInvalidField.current.giveFocus();
			}
		}
	};

	const getFirstInvalidField = (): RefObject<FieldRef> | undefined => {
		let result: RefObject<FieldRef> | undefined;
		Object.values(fieldData).forEach((o: {staticData: StaticFieldData, valid: boolean, focus: boolean, ref: RefObject<FieldRef>}) => {
			if (o.valid === false) {
				result = o.ref;
				return;
			} 
		});

		return result;
	};

	const handleTestTypeChange = (e: any) => {
		setCurrentSettings({...currentSettings, testType: Number(e.target.value), testTypeObject: getTestTypeDefaultSettings(Number(e.target.value))});

		// Reset these fields' validity which belong to test type sub settings
		setFieldData({...fieldData, 
			wordAmount: {...fieldData.wordAmount, valid: true}, 
			timeLimit: {...fieldData.timeLimit, valid: true}
		});
	};

	const setNewWordAmount = (newWordAmount: string, valid: boolean) => {
		setCurrentSettings({...currentSettings, testTypeObject: {...currentSettings.testTypeObject, amount: newWordAmount}});
		setFieldData({...fieldData, wordAmount: {...fieldData.wordAmount, valid: valid}});
	};

	const setNewTime = (newTime: string, valid: boolean) => {
		setCurrentSettings({...currentSettings, testTypeObject: {...currentSettings.testTypeObject, time: newTime}});
		setFieldData({...fieldData, timeLimit: {...fieldData.timeLimit, valid: valid}});
	};

	const handleRestoreDefaults = () => {
		setCurrentSettings(DefaultSettings);

		// Reset each field's value and validity
		for (const [key, value] of Object.entries(fieldData)) {
			value.ref.current?.resetValue();
			value.valid = true;
			setFieldData({...fieldData, [key]: value});
		}
	};

	return (
		<Box sx={{ p: 2, border: "1px solid black", borderRadius: 2 }}>
			<form className="form settings-form" onSubmit={ handleSubmit }>
				<FormControl>
					<fieldset>
						<legend>Test Settings</legend>
						<div className="field">
							<TextField select
								label="Test Mode"
								variant="outlined"
								helperText="Select a test mode" 
								value={currentSettings.testType}
								onChange={handleTestTypeChange}>
								<MenuItem key={TestType.Amount} value={TestType.Amount}>{ getTestTypeName(TestType.Amount) }</MenuItem>
								<MenuItem key={TestType.Endless} value={TestType.Endless}>{ getTestTypeName(TestType.Endless) }</MenuItem>
								<MenuItem key={TestType.Timed} value={TestType.Timed}>{ getTestTypeName(TestType.Timed) }</MenuItem>
							</TextField>
						</div>
						<div className="type-sub-form">
							{currentSettings.testType === TestType.Amount && <div className="amount-sub-form">
								<Field
									type={ FieldType.Number }
									ref={ wordAmountRef }
									staticData={ fieldData.wordAmount.staticData }
									focus={ fieldData.wordAmount.focus }
									valueSetter={ setNewWordAmount }/>
							</div>}
							{currentSettings.testType === TestType.Endless && <div className="endless-sub-form">
							</div>}
							{currentSettings.testType === TestType.Timed && <div className="timed-sub-form">
								<Field
									type={ FieldType.Number }
									ref={ timeLimitRef }
									staticData={ fieldData.timeLimit.staticData }
									focus={ fieldData.timeLimit.focus }
									valueSetter={ setNewTime }/>
							</div>}
						</div>
					</fieldset>
					<fieldset>
						<legend>Verb Settings</legend>
					</fieldset>
					<fieldset>
						<legend>Verb Form Settings</legend>
					</fieldset>
					<div className="form-button-row">
						<Button variant="outlined" color="darkBlue" type="button" className="button-primary" onClick={ handleRestoreDefaults }>Restore Defaults</Button>
						<Button variant="contained" color="darkBlue" type="submit" className="button-primary">Start</Button>
					</div>
				</FormControl>
			</form>
		</Box>
	);
};
 
export default SettingsForm;