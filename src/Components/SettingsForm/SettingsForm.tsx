import { ChangeEvent, ElementRef, FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { DefaultSettings, SettingsObject, TestType, getTestTypeDefaultSettings, getTestTypeName, DefaultAmountSettings, DefaultTimedSettings } from "../../SettingsDef";
import Field, { FieldRef, FieldType, StaticFieldData } from "../Field/Field";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, MenuItem, TextField } from "@mui/material";
import { FormNames, VerbFormData, VerbFormNamesInfo, VerbFormSubTypeNamesInfo, WithNegativeForms, WithNegativePoliteForms, WithPlainForms, WithPoliteForms } from "../../Verb/VerbFormDefs";
import { Label } from "@mui/icons-material";

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
		vtIchidan: DefaultSettings.verbType.vtIchidan,
		vtGodan: DefaultSettings.verbType.vtGodan,
		vtIrregular: DefaultSettings.verbType.vtIrregular
	});
	const verbTypeError = [verbTypeData.vtIchidan, verbTypeData.vtGodan, verbTypeData.vtIrregular].filter((v) => v).length === 0;
	const vtInputRef = useRef<HTMLInputElement>(null);

	const [verbLevelData, setVerbLevelData] = useState({
		vlN5: DefaultSettings.verbLevel.vlN5,
		vlN4: DefaultSettings.verbLevel.vlN4,
		vlN3: DefaultSettings.verbLevel.vlN3,
		vlN2: DefaultSettings.verbLevel.vlN2,
		vlN1: DefaultSettings.verbLevel.vlN1
	});
	const verbLevelError = [verbLevelData.vlN5, verbLevelData.vlN4, verbLevelData.vlN3, verbLevelData.vlN2, verbLevelData.vlN1].filter((v) => v).length === 0;
	const vlInputRef = useRef<HTMLInputElement>(null);

	const [conjugationLevelData, setConjugationLevelData] = useState({
		clN5: true,
		clN4: false,
		clN3: false,
		clN2: false,
		clN1: false
	});

	const [verbFormData, setVerbFormData] = useState<VerbFormData>(DefaultSettings.verbForms);
	
	const isVerbFormError = (): boolean => {
		for(const o of Object.entries(verbFormData)) {
			const formInfo = o[1];
			for(const v of Object.entries(formInfo)) {
				if (v[1]) return false;
			}
		}

		return true;
	};
	const vfInputRef = useRef<HTMLInputElement>(null);

	const [vfAll, setVfAll] = useState<boolean>(false);

	useEffect(() => {
		console.log(verbFormData);
		setCurrentSettings({...currentSettings, verbForms: verbFormData});
	}, [verbFormData]);


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

			if(isVerbFormError()) {
				if(vfInputRef.current) {
					vfInputRef.current.focus();
					return;
				}
			}

			// Form is valid, submit
			console.log(currentSettings);
			console.log(DefaultSettings);
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

	const handleTestTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
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

		verbTypeData.vtIchidan = DefaultSettings.verbType.vtIchidan;
		verbTypeData.vtGodan= DefaultSettings.verbType.vtGodan;
		verbTypeData.vtIrregular = DefaultSettings.verbType.vtIrregular;

		verbLevelData.vlN5 = DefaultSettings.verbLevel.vlN5;
		verbLevelData.vlN4 = DefaultSettings.verbLevel.vlN4;
		verbLevelData.vlN3 = DefaultSettings.verbLevel.vlN3;
		verbLevelData.vlN2 = DefaultSettings.verbLevel.vlN2;
		verbLevelData.vlN1 = DefaultSettings.verbLevel.vlN1;

		conjugationLevelData.clN5 = true;
		conjugationLevelData.clN4 = false;
		conjugationLevelData.clN3 = false;
		conjugationLevelData.clN2 = false;
		conjugationLevelData.clN1 = false;

		console.log(DefaultSettings.verbForms);
		setVerbFormData(DefaultSettings.verbForms);
	};

	const handleVtChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCurrentSettings({...currentSettings, verbType: {...currentSettings.verbType, [e.target.name]: e.target.checked}});
		setVerbTypeData({...verbTypeData, [e.target.name]: e.target.checked});
	};

	const handleVlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCurrentSettings({...currentSettings, verbLevel: {...currentSettings.verbLevel, [e.target.name]: e.target.checked}});
		setVerbLevelData({...verbLevelData, [e.target.name]: e.target.checked});
	};

	const handleClChange = (e: ChangeEvent<HTMLInputElement>) => {
		setConjugationLevelData({...conjugationLevelData, [e.target.name]: e.target.checked});
	};

	const handleVfChange = (e: ChangeEvent<HTMLInputElement>, form: FormNames) => {
		//setCurrentSettings({...currentSettings, [e.target.name]: e.target.checked});
		setVerbFormData({...verbFormData, [form]: {...verbFormData[form], [e.target.name]: e.target.checked}});
	};

	const handleVfChangeParent = (e: ChangeEvent<HTMLInputElement>, form: FormNames) => {
		if(e.target.checked) {
			const obj: Record<string, boolean> = {};
			for(const v in verbFormData[form]) {
				obj[v] = true;
			}
			setVerbFormData({...verbFormData, [form]: obj});

		} else if (!e.target.indeterminate) {
			const obj: Record<string, boolean> = {};
			for(const v in verbFormData[form]) {
				obj[v] = false;
			}
			setVerbFormData({...verbFormData, [form]: obj});
		}
	};

	const handleVfAllChange = (e: ChangeEvent<HTMLInputElement>) => {
		setVfAll(e.target.checked);

		let toSet: boolean;
		if(e.target.checked) {
			toSet = true;
		} else if (!e.target.indeterminate) {
			toSet = false;
		} else {
			return;
		}

		const obj: VerbFormData = JSON.parse(JSON.stringify(DefaultSettings.verbForms));
		Object.keys(obj).forEach(key => {
			if (Object.keys(obj[key as keyof VerbFormData]).includes("plain")) {
				(obj[key as WithPlainForms]).plain = toSet;
			}
			if (Object.keys(obj[key as keyof VerbFormData]).includes("polite")) {
				(obj[key as WithPoliteForms]).polite = toSet;
			}
			if (Object.keys(obj[key as keyof VerbFormData]).includes("polite")) {
				(obj[key as WithNegativeForms]).negativePlain = toSet;
			}
			if (Object.keys(obj[key as keyof VerbFormData]).includes("polite")) {
				(obj[key as WithNegativePoliteForms]).negativePolite = toSet;
			}
		});

		setVerbFormData(obj);
	};

	const checkIndeterminate = (form: FormNames): boolean => {
		const arr: boolean[] = [];
		for(const v of Object.entries(verbFormData[form])) {
			arr.push(v[1]);
		}
		return !(arr.every(v => v === true) || arr.every(v => v === false));
	};

	const [showVfSubOptions, setShowVfSubOptions] = useState<boolean>(false);
	const toggleVfSubOptions = () => {
		setShowVfSubOptions(!showVfSubOptions);
	};

	const checkboxParentGroup = (name: FormNames, label: string, first = false) => {
		return (
			<div>
				<FormGroup>
					<span className={"checkbox-parent-group"}>
						<span className="parent-checkbox">
							<FormControlLabel
								control={
									<Checkbox checked={verbFormData[name].plain}
										indeterminate={checkIndeterminate(name)}
										onChange={(e) => handleVfChangeParent(e, name)}
										name={name}
										inputRef={first? vfInputRef : null}/>
								}
								label={label}
							/>
						</span>
						{showVfSubOptions && <span className="children-checkboxes">
							{"plain" in verbFormData[name] &&
								<span>
									<FormControlLabel
										control={
											<Checkbox checked={verbFormData[name as  WithPlainForms].plain}
												onChange={(e) => handleVfChange(e, name)}
												name="plain"/>
										}
										label={VerbFormSubTypeNamesInfo.plain}
									/>
								</span>
							}
							{"polite" in verbFormData[name] &&
								<span>
									<FormControlLabel
										control={
											<Checkbox checked={verbFormData[name as WithPoliteForms].polite}
												onChange={(e) => handleVfChange(e, name)}
												name="polite"/>
										}
										label={VerbFormSubTypeNamesInfo.polite}
									/>
								</span>
							}
							{"negativePlain" in verbFormData[name] &&
								<span>
									<FormControlLabel
										control={
											<Checkbox checked={verbFormData[name as WithNegativeForms].negativePlain}
												onChange={(e) => handleVfChange(e, name)}
												name={VerbFormSubTypeNamesInfo.negativePlain}
											/>
										}
										label="Negative Plain"
									/>
								</span>
							}
							{"negativePolite" in verbFormData[name] &&
								<span>
									<FormControlLabel
										control={
											<Checkbox checked={verbFormData[name as WithNegativePoliteForms].negativePolite}
												onChange={(e) => handleVfChange(e, name)}
												name="negativePolite"/>
										}
										label={VerbFormSubTypeNamesInfo.negativePolite}
									/>
								</span>
							}
						</span>}
					</span>
				</FormGroup>
			</div>
		);
	};

	return (
		<Box sx={{ p: 2, border: "1px solid black", borderRadius: 2 }}>
			<form className="form settings-form" onSubmit={ handleSubmit }>
				<div>
					<FormControl component="fieldset" variant="standard" error={ !fieldData.wordAmount.valid || !fieldData.timeLimit.valid }>
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
					<FormControl component="fieldset" variant="standard" error={isVerbFormError()}>
						<FormLabel component="legend" className="form-title">Conjguation Settings</FormLabel>
						{false && 
							<div className="checkbox-group">
								<FormLabel>Filter by JLPT Level</FormLabel>
								<FormGroup>
									<span>
										<FormControlLabel
											control={
												<Checkbox checked={conjugationLevelData.clN5}
													onChange={handleClChange}
													name="clN5"
													inputRef={vlInputRef}/>
											}
											label="N5"
										/>
										<FormControlLabel
											control={
												<Checkbox checked={conjugationLevelData.clN4}
													onChange={handleClChange}
													name="clN4"/>
											}
											label="N4"
										/>
										<FormControlLabel
											control={
												<Checkbox checked={conjugationLevelData.clN3}
													onChange={handleClChange}
													name="clN3"/>
											}
											label="N3"
										/>
										<FormControlLabel
											control={
												<Checkbox checked={conjugationLevelData.clN2}
													onChange={handleClChange}
													name="clN2"/>
											}
											label="N2"
										/>
										<FormControlLabel
											control={
												<Checkbox checked={conjugationLevelData.clN1}
													onChange={handleClChange}
													name="clN1"/>
											}
											label="N1"
										/>
									</span>
								</FormGroup>
							</div>
						}
						<div className="checkbox-group">
							<FormLabel>Verb Forms</FormLabel>
							<div className="lineBreak"></div>
							<div className={showVfSubOptions? "checkbox-grid-wide" : "checkbox-grid-slim"}>
								<div className={"checkbox-parent-group " + (showVfSubOptions? "toggle-row-wide" : "toggle-row-slim")}>
									<FormControlLabel
										control={
											<Checkbox checked={vfAll}
												onChange={handleVfAllChange}
												name="vfAll"/>
										}
										label="All"
									/>
									<span>
										<label style={{marginRight: "8px"}}>{showVfSubOptions? "Hide" : "Show"} sub-options</label>
										<Button sx={{marginRight: "16px"}}variant="outlined" color="darkBlue" type="button" onClick={ toggleVfSubOptions }>
											{showVfSubOptions? "Hide" : "Show"}
										</Button>
									</span>
								</div>
								{showVfSubOptions && 
									<div>
										{checkboxParentGroup("present", VerbFormNamesInfo.present, true)}
										{checkboxParentGroup("past", VerbFormNamesInfo.past)}
										{checkboxParentGroup("te", VerbFormNamesInfo.te)}
										{checkboxParentGroup("naide", VerbFormNamesInfo.naide)}
										{checkboxParentGroup("tai", VerbFormNamesInfo.tai)}
										{checkboxParentGroup("zu", VerbFormNamesInfo.zu)}
										{checkboxParentGroup("volitional", VerbFormNamesInfo.volitional)}
										{checkboxParentGroup("imperative", VerbFormNamesInfo.imperative)}
										{checkboxParentGroup("baConditional", VerbFormNamesInfo.baConditional)}
										{checkboxParentGroup("taraConditional", VerbFormNamesInfo.taraConditional)}
										{checkboxParentGroup("stem", VerbFormNamesInfo.stem)}
									</div>
								}
								{!showVfSubOptions && 
									<div className="checkbox-parent-group">
										<div>
											{checkboxParentGroup("present", VerbFormNamesInfo.present, true)}
											{checkboxParentGroup("past", VerbFormNamesInfo.past)}
											{checkboxParentGroup("te", VerbFormNamesInfo.te)}
											{checkboxParentGroup("naide", VerbFormNamesInfo.naide)}
											{checkboxParentGroup("tai", VerbFormNamesInfo.tai)}
											{checkboxParentGroup("zu", VerbFormNamesInfo.zu)}
										</div>
										<div>
											{checkboxParentGroup("volitional", VerbFormNamesInfo.volitional)}
											{checkboxParentGroup("imperative", VerbFormNamesInfo.imperative)}
											{checkboxParentGroup("baConditional", VerbFormNamesInfo.baConditional)}
											{checkboxParentGroup("taraConditional", VerbFormNamesInfo.taraConditional)}
											{checkboxParentGroup("stem", VerbFormNamesInfo.stem)}
										</div>
									</div>
								}
							</div>
						</div>
						<FormHelperText>{ isVerbFormError()? "Select at least one" : "" }</FormHelperText>
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