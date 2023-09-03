import { ChangeEvent, ElementRef, FormEvent, RefObject, useRef, useState } from "react";
import { DefaultSettings, SettingsObject, TestType, getTestTypeDefaultSettings, getTestTypeName, DefaultAmountSettings, DefaultTimedSettings } from "../../SettingsDef";
import Field, { FieldRef, FieldType, StaticFieldData } from "../Field/Field";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, MenuItem, TextField } from "@mui/material";

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

	const [verbTypeData, setVerbTypeData] = useState({
		vtIchidan: DefaultSettings.vtIchidan,
		vtGodan: DefaultSettings.vtGodan,
		vtIrregular: DefaultSettings.vtIrregular
	});
	const verbTypeError = [verbTypeData.vtIchidan, verbTypeData.vtGodan, verbTypeData.vtIrregular].filter((v) => v).length === 0;
	const vtInputRef = useRef<HTMLInputElement>(null);

	const [verbLevelData, setVerbLevelData] = useState({
		vlN5: DefaultSettings.vlN5,
		vlN4: DefaultSettings.vlN4,
		vlN3: DefaultSettings.vlN3,
		vlN2: DefaultSettings.vlN2,
		vlN1: DefaultSettings.vlN1
	});
	const verbLevelError = [verbLevelData.vlN5, verbLevelData.vlN4, verbLevelData.vlN3, verbLevelData.vlN2, verbLevelData.vlN1].filter((v) => v).length === 0;
	const vlInputRef = useRef<HTMLInputElement>(null);


	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const firstInvalidField: RefObject<FieldRef> | undefined = getFirstInvalidField();
		if (!firstInvalidField) {
			if(verbTypeError) {
				if (vtInputRef.current) {
					vtInputRef.current.focus();
					return;
				}
			}

			if(verbLevelError) {
				if (vlInputRef.current) {
					vlInputRef.current.focus();
					return;
				}
			}

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

		verbTypeData.vtIchidan = DefaultSettings.vtIchidan;
		verbTypeData.vtGodan= DefaultSettings.vtGodan;
		verbTypeData.vtIrregular = DefaultSettings.vtIrregular;

		verbLevelData.vlN5 = DefaultSettings.vlN5;
		verbLevelData.vlN4 = DefaultSettings.vlN4;
		verbLevelData.vlN3 = DefaultSettings.vlN3;
		verbLevelData.vlN2 = DefaultSettings.vlN2;
		verbLevelData.vlN1 = DefaultSettings.vlN1;
	};

	const handleVtChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCurrentSettings({...currentSettings, [e.target.name]: e.target.checked});
		setVerbTypeData({...verbTypeData, [e.target.name]: e.target.checked});
	};

	const handleVlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCurrentSettings({...currentSettings, [e.target.name]: e.target.checked});
		setVerbLevelData({...verbLevelData, [e.target.name]: e.target.checked});
	};

	return (
		<Box sx={{ p: 2, border: "1px solid black", borderRadius: 2 }}>
			<form className="form settings-form" onSubmit={ handleSubmit }>
				<div>
					<FormControl component="fieldset" variant="standard">
						<FormLabel component="legend" className="form-title">Test Settings</FormLabel>
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
					</FormControl>
				</div>
				<div>
					<FormControl component="fieldset" variant="standard" error={ verbTypeError || verbLevelError }>
						<FormLabel component="legend" className="form-title">Verb Settings</FormLabel>
						<div className="checkbox-group">
							<FormLabel>Verb Type</FormLabel>
							<FormGroup>
								<span>
									<FormControlLabel
										control={
											<Checkbox checked={verbTypeData.vtIchidan}
												onChange={handleVtChange}
												name="vtIchidan"
												inputRef={vtInputRef}/>
										}
										label="Ichidan"
									/>
									<FormControlLabel
										control={
											<Checkbox checked={verbTypeData.vtGodan}
												onChange={handleVtChange}
												name="vtGodan"/>
										}
										label="Godan"
									/>
									<FormControlLabel
										control={
											<Checkbox checked={verbTypeData.vtIrregular}
												onChange={handleVtChange}
												name="vtIrregular"/>
										}
										label="Irregular"
									/>
								</span>
							</FormGroup>
							<FormHelperText>{ verbTypeError? "Select at least one" : "" }</FormHelperText>
						</div>
						<div className="checkbox-group">
							<FormLabel>JLPT Level</FormLabel>
							<FormGroup>
								<span>
									<FormControlLabel
										control={
											<Checkbox checked={verbLevelData.vlN5}
												onChange={handleVlChange}
												name="vlN5"
												inputRef={vlInputRef}/>
										}
										label="N5"
									/>
									<FormControlLabel
										control={
											<Checkbox checked={verbLevelData.vlN4}
												onChange={handleVlChange}
												name="vlN4"/>
										}
										label="N4"
									/>
									<FormControlLabel
										control={
											<Checkbox checked={verbLevelData.vlN3}
												onChange={handleVlChange}
												name="vlN3"/>
										}
										label="N3"
									/>
									<FormControlLabel
										control={
											<Checkbox checked={verbLevelData.vlN2}
												onChange={handleVlChange}
												name="vlN2"/>
										}
										label="N2"
									/>
									<FormControlLabel
										control={
											<Checkbox checked={verbLevelData.vlN1}
												onChange={handleVlChange}
												name="vlN1"/>
										}
										label="N1"
									/>
								</span>
							</FormGroup>
							<FormHelperText>{ verbLevelError? "Select at least one" : "" }</FormHelperText>
						</div>
					</FormControl>
				</div>
				<div>
					<FormControl component="fieldset" variant="standard">
						<FormLabel component="legend" className="form-title">Conjguation Settings</FormLabel>
					</FormControl>
				</div>
				<div className="form-button-row">
					<Button variant="outlined" color="darkBlue" type="button" className="button-primary" onClick={ handleRestoreDefaults }>Restore Defaults</Button>
					<Button variant="contained" color="darkBlue" type="submit" className="button-primary">Start</Button>
				</div>
			</form>
		</Box>
	);
};
 
export default SettingsForm;