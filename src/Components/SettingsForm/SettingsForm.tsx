import { ChangeEvent, ElementRef, FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { DefaultSettings, SettingsObject, TestType, getTestTypeDefaultSettings, getTestTypeName, DefaultAmountSettings, DefaultTimedSettings, AmountSettingsObject, TimedSettingsObject } from "../../SettingsDef";
import Field, { FieldRef, FieldType, StaticFieldData } from "../Field/Field";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, MenuItem, Switch, TextField } from "@mui/material";
import { AuxFormData, AuxFormDisplayNames, AuxFormNames, FormNames, VerbFormData, VerbFormDisplayNames, VerbFormSubTypeDisplayNames, WithNegativeForms, WithNegativePoliteForms, WithPlainForms, WithPoliteForms } from "../../Verb/VerbFormDefs";
import useMeasure from "react-use-measure";
import { ROOT_ENDPOINT } from "../../Connection/settings";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { setSettings } from "../../Redux/Settings/settingsActions";
import { setTestState } from "../../Redux/Test/testActions";
import { InTestState } from "../../Redux/Test/testReducer";

const enum LoadState {
	Loading, Loaded, Error
}

const SettingsForm = () => {
	const dispatch = useDispatch();
	const savedSettings: SettingsObject = useSelector((state: RootState) => state.settings.currentSettings);
	const userId: number = useSelector((state: RootState) => state.settings.userId);

	const [loadState, setLoadState] = useState<LoadState>(LoadState.Loading);
	const [currentSettings, setCurrentSettings] = useState<SettingsObject>(DefaultSettings);

	const [formRef, { width }] = useMeasure();
	const [formWidth, setFormWidth] = useState<number>(1920);
	useEffect(() => {
		setFormWidth(width);
	}, [width]);
  
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
			ref: timeLimitRef
		}
	});

	const checkAllVt = (): boolean => {
		return verbTypeData.vtBu && verbTypeData.vtGu && verbTypeData.vtKu && verbTypeData.vtMu && verbTypeData.vtNu 
			&& verbTypeData.vtRu && verbTypeData.vtSu && verbTypeData.vtTsu && verbTypeData.vtU;
	};

	const checkAnyVt = (): boolean => {
		return verbTypeData.vtBu || verbTypeData.vtGu || verbTypeData.vtKu || verbTypeData.vtMu || verbTypeData.vtNu 
			|| verbTypeData.vtRu || verbTypeData.vtSu || verbTypeData.vtTsu || verbTypeData.vtU;
	};

	const checkIndeterminateVt = (): boolean => {
		return checkAnyVt() && !checkAllVt();
	};

	const [verbLevelData, setVerbLevelData] = useState(DefaultSettings.verbLevel);
	
	const verbLevelError = [verbLevelData.vlN5, verbLevelData.vlN4, verbLevelData.vlN3, verbLevelData.vlN2, verbLevelData.vlN1].filter((v) => v).length === 0;
	const vlInputRef = useRef<HTMLInputElement>(null);

	const checkVerbTypeNoResults = (): boolean => {
		if (verbTypeData.vtIrregular && !(checkAnyVt() || verbTypeData.vtIchidan)) {
			if (!(verbLevelData.vlN5 || verbLevelData.vlN4 || verbLevelData.vlN1)) {
				// No irregular verbs for these levels
				return true;
			}
		}

		if (!verbLevelData.vlN5) {
			if (verbTypeData.vtNu && !(verbTypeData.vtBu || verbTypeData.vtGu || verbTypeData.vtKu || verbTypeData.vtMu || verbTypeData.vtRu
				|| verbTypeData.vtSu || verbTypeData.vtTsu || verbTypeData.vtU)) {
				return true;
			}
		}

		return false;
	};

	const [verbTypeData, setVerbTypeData] = useState(DefaultSettings.verbType);

	const verbTypeError = [verbTypeData.vtIchidan, verbTypeData.vtIrregular, verbTypeData.vtBu, verbTypeData.vtGu, verbTypeData.vtKu,
		verbTypeData.vtMu, verbTypeData.vtNu, verbTypeData.vtRu, verbTypeData.vtSu, verbTypeData.vtTsu, verbTypeData.vtU].filter((v) => v).length === 0;
	const verbTypeNoResultsError: boolean = checkVerbTypeNoResults();
	const vtInputRef = useRef<HTMLInputElement>(null);


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

	const [auxFormData, setAuxFormData] = useState<AuxFormData>(DefaultSettings.auxForms);

	const isExclusiveAuxError = (): boolean => {
		if (!currentSettings.exclusiveAux) {
			return false;
		}

		for(const o of Object.entries(auxFormData)) {
			const formInfo = o[1];
			if (formInfo.standard === true) {
				return false;
			}
		}

		return true;
	};
	const vfaInputRef = useRef<HTMLInputElement>(null);
	const vfaExclusiveInputRef = useRef<HTMLInputElement>(null);

	const setNewSettings = (newSettings: SettingsObject) => {
		setCurrentSettings(newSettings);

		fieldData.wordAmount.staticData.startingValue = (newSettings.testTypeObject as AmountSettingsObject)?.amount;
		fieldData.timeLimit.staticData.startingValue = (newSettings.testTypeObject as TimedSettingsObject)?.time;

		for (const [key, value] of Object.entries(fieldData)) {
			value.ref.current?.resetValue();
			value.valid = true;
			setFieldData({...fieldData, [key]: value});
		}

		fieldData.wordAmount.staticData.startingValue = DefaultAmountSettings.amount;
		fieldData.timeLimit.staticData.startingValue = DefaultTimedSettings.time;

		setVerbLevelData(newSettings.verbLevel);
		setVerbTypeData(newSettings.verbType);
		setVerbFormData(newSettings.verbForms);
		setAuxFormData(newSettings.auxForms);
	};

	useEffect(() => {
		const endpoint = ROOT_ENDPOINT + "/checkLive";
		fetch(endpoint)
			.then((response: Response) => {
				if (response.status === 200) {
					return response.json();
				}
				throw new Error(response.status.toString());
			})
			.then((data) => {
				if (data.isLive === true) {
					setLoadState(LoadState.Loaded);
					setNewSettings(savedSettings);
					return;
				}
				setLoadState(LoadState.Error);
			})
			.catch((err) => {
				console.log(err);
				setLoadState(LoadState.Error);
			});
	}, []);

	useEffect(() => {
		setCurrentSettings({...currentSettings, verbType: verbTypeData});
	}, [verbTypeData]);

	useEffect(() => {
		setCurrentSettings({...currentSettings, verbForms: verbFormData});
	}, [verbFormData]);

	useEffect(() => {
		setCurrentSettings({...currentSettings, auxForms: auxFormData});
	}, [auxFormData]);


	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const firstInvalidField: RefObject<FieldRef> | undefined = getFirstInvalidField();
		if (!firstInvalidField) {
			if(verbTypeError) {
				if (vtInputRef.current) {
					vtInputRef.current.focus();
				}
				return;
			}

			if(verbLevelError) {
				if (vlInputRef.current) {
					vlInputRef.current.focus();
				}
				return;
			}

			if(verbTypeNoResultsError) {
				if (vtInputRef.current) {
					vtInputRef.current.focus();
				}
				return;
			}

			if(isVerbFormError()) {
				if(vfInputRef.current) {
					vfInputRef.current.focus();
				}
				return;
			}

			if(isExclusiveAuxError()) {
				if(vfaExclusiveInputRef.current) {
					vfaExclusiveInputRef.current.focus();
				}
				return;
			}

			// Form is valid, submit
			dispatch(setSettings(currentSettings));
			submitSettings();
		} else {
			if (firstInvalidField.current) {
				firstInvalidField.current.giveFocus();
			}
		}
	};

	const submitSettings = () => {
		dispatch(setTestState(InTestState.Loading));

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

					dispatch(setTestState(InTestState.True));
				})
				.catch((err) => {
					console.log(err);
					dispatch(setTestState(InTestState.Error));
				});
		} catch (e) {
			dispatch(setTestState(InTestState.Error));
		}
	};

	const getFirstInvalidField = (): RefObject<FieldRef> | undefined => {
		let result: RefObject<FieldRef> | undefined;
		Object.values(fieldData).forEach((o: {staticData: StaticFieldData, valid: boolean, ref: RefObject<FieldRef>}) => {
			if (o.valid === false) {
				result = o.ref;
				return;
			} 
		});

		return result;
	};

	const handleTestTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const testType = Number(e.target.value);
		const newTestTypeObject = getTestTypeDefaultSettings(testType);
		setCurrentSettings({...currentSettings, testType: testType, testTypeObject: newTestTypeObject});

		wordAmountRef.current?.resetValue();
		timeLimitRef.current?.resetValue();
	};

	const setNewWordAmount = (newWordAmount: string, valid: boolean) => {
		setCurrentSettings({...currentSettings, testTypeObject: {...currentSettings.testTypeObject, amount: Number(newWordAmount)}});
		setFieldData({...fieldData, wordAmount: {...fieldData.wordAmount, valid: valid}});
	};

	const setNewTime = (newTime: string, valid: boolean) => {
		setCurrentSettings({...currentSettings, testTypeObject: {...currentSettings.testTypeObject, time: Number(newTime)}});
		setFieldData({...fieldData, timeLimit: {...fieldData.timeLimit, valid: valid}});
	};

	const handleRestoreDefaults = () => {
		setNewSettings(DefaultSettings);
	};

	const handleVtChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCurrentSettings({...currentSettings, verbType: {...currentSettings.verbType, [e.target.name]: e.target.checked}});
		setVerbTypeData({...verbTypeData, [e.target.name]: e.target.checked});
	};

	const handleVlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCurrentSettings({...currentSettings, verbLevel: {...currentSettings.verbLevel, [e.target.name]: e.target.checked}});
		setVerbLevelData({...verbLevelData, [e.target.name]: e.target.checked});
	};

	const handleVfChange = (e: ChangeEvent<HTMLInputElement>, form: FormNames) => {
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
			if (Object.keys(obj[key as keyof VerbFormData]).includes("negativePlain")) {
				(obj[key as WithNegativeForms]).negativePlain = toSet;
			}
			if (Object.keys(obj[key as keyof VerbFormData]).includes("negativePolite")) {
				(obj[key as WithNegativePoliteForms]).negativePolite = toSet;
			}
		});

		setVerbFormData(obj);
	};

	const handleVfAllSubOfTypeChange = (e: ChangeEvent<HTMLInputElement>, type: string) => {
		let toSet: boolean;
		if(e.target.checked) {
			toSet = true;
		} else if (!e.target.indeterminate) {
			toSet = false;
		} else {
			return;
		}

		let setEveryForm = false;
		if(!(checkAllForms() || checkAllIndeterminate())) {
			// If no forms are selected, then tell it set the whole column
			setEveryForm = true;
		}

		const obj: VerbFormData = JSON.parse(JSON.stringify(verbFormData));
		Object.keys(obj).forEach(key => {
			// First check if form is selected at all
			if(setEveryForm || checkIndeterminateVf(key as FormNames) || checkAllSubOptions(key as FormNames)) {
				// Then set the option of the correct type
				if (type === "plain" && Object.keys(obj[key as keyof VerbFormData]).includes("plain")) {
					(obj[key as WithPlainForms]).plain = toSet;
				}
				else if (type === "polite" && Object.keys(obj[key as keyof VerbFormData]).includes("polite")) {
					(obj[key as WithPoliteForms]).polite = toSet;
				}
				else if (type === "negativePlain" && Object.keys(obj[key as keyof VerbFormData]).includes("negativePlain")) {
					(obj[key as WithNegativeForms]).negativePlain = toSet;
				}
				else if (type === "negativePolite" && Object.keys(obj[key as keyof VerbFormData]).includes("negativePolite")) {
					(obj[key as WithNegativePoliteForms]).negativePolite = toSet;
				}
			}
		});

		setVerbFormData(obj);
	};

	const checkAllForms = (): boolean => {
		for(const o of Object.entries(verbFormData)) {
			let allSubs = true; 
			for(const v of Object.entries(o[1])) {
				if(v[1] !== true) {
					allSubs = false;
					break;
				}
			}

			if(!allSubs) return false;
		}

		return true;
	};

	const checkAllIndeterminate = (): boolean => {
		let foundASub = false;
		for(const o of Object.entries(verbFormData)) {
			let foundSub = false; 
			for(const v of Object.entries(o[1])) {
				if(v[1] === true) {
					foundSub = true;
					break;
				}
			}

			if(foundSub) {
				foundASub = true;
				break;
			}
		}

		return foundASub && !checkAllForms();
	};

	const checkAllSubsOfType = (type: string): boolean => {
		const obj = verbFormData;
		let totalRes = true;
		let foundASetForm = false;
		Object.keys(obj).forEach(key => {
			let res = true;
			// first check if form is selected at all
			if(checkIndeterminateVf(key as FormNames) || checkAllSubOptions(key as FormNames)) {
				foundASetForm = true;
				// then check that the specified type is selected
				if (type === "plain" && Object.keys(obj[key as keyof VerbFormData]).includes("plain")) {
					if(obj[key as WithPoliteForms].plain !== true) {
						res = false;
					}
				}
				else if (type === "polite" &&  Object.keys(obj[key as keyof VerbFormData]).includes("polite")) {
					if(obj[key as WithPoliteForms].polite !== true) {
						res = false;
					}
				}
				else if (type === "negativePlain" &&  Object.keys(obj[key as keyof VerbFormData]).includes("negativePlain")) {
					if(obj[key as WithNegativeForms].negativePlain !== true) {
						res = false;
					}
				}
				else if (type === "negativePolite" &&  Object.keys(obj[key as keyof VerbFormData]).includes("negativePolite")) {
					if(obj[key as WithNegativePoliteForms].negativePolite !== true) {
						res = false;
					}
				}
			}

			if(!res) {
				totalRes = false;
				return;
			}
		});

		return foundASetForm && totalRes;
	};

	const checkAllSubsOfTypeIndeterminate = (type: string): boolean => {
		const obj = verbFormData;

		if(checkAllSubsOfType(type)) {
			return false;
		}

		let totalRes = false;
		Object.keys(obj).forEach(key => {
			let res = false;
			// first check if form is selected at all
			if(checkIndeterminateVf(key as FormNames) || checkAllSubOptions(key as FormNames)) {
				// then check if the specified type is selected
				if (type === "plain" && Object.keys(obj[key as keyof VerbFormData]).includes("plain")) {
					if(obj[key as WithPlainForms].plain === true) {
						res = true;
					}
				}
				else if (type === "polite" &&  Object.keys(obj[key as keyof VerbFormData]).includes("polite")) {
					if(obj[key as WithPoliteForms].polite === true) {
						res = true;
					}
				}
				else if (type === "negativePlain" &&  Object.keys(obj[key as keyof VerbFormData]).includes("negativePlain")) {
					if(obj[key as WithNegativeForms].negativePlain === true) {
						res = true;
					}
				}
				else if (type === "negativePolite" &&  Object.keys(obj[key as keyof VerbFormData]).includes("negativePolite")) {
					if(obj[key as WithNegativePoliteForms].negativePolite === true) {
						res = true;
					}
				}
			}

			if(res) {
				totalRes = true;
				return;
			}
		});

		return totalRes;
	};

	const checkAllSubOptions = (form: FormNames): boolean => {
		const arr: boolean[] = [];
		for(const v of Object.entries(verbFormData[form])) {
			arr.push(v[1]);
		}
		return arr.every(v => v === true);
	};

	const checkIndeterminateVf = (form: FormNames): boolean => {
		const arr: boolean[] = [];
		for(const v of Object.entries(verbFormData[form])) {
			arr.push(v[1]);
		}
		return !(arr.every(v => v === true) || arr.every(v => v === false));
	};

	const [showVfSubOptions, setShowVfSubOptions] = useState<boolean>(false);
	const handleVfSubOptionsChange = (e: ChangeEvent<HTMLInputElement>) => {
		setShowVfSubOptions(e.target.checked);
	};

	const handleGodanChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setVerbTypeData({...verbTypeData, vtBu: true, vtGu: true, vtKu: true, vtMu: true, vtNu: true, vtRu: true, vtSu: true, vtTsu: true, vtU: true});
		} else {
			setVerbTypeData({...verbTypeData, vtBu: false, vtGu: false, vtKu: false, vtMu: false, vtNu: false, vtRu: false, vtSu: false, vtTsu: false, vtU: false});
		}
	};


	const handleVfaChange = (e: ChangeEvent<HTMLInputElement>, form: AuxFormNames) => {
		setAuxFormData({...auxFormData, [form]: {...auxFormData[form], standard: e.target.checked}});
	};

	const checkAllAuxForms = (): boolean => {
		for(const o of Object.entries(auxFormData)) {
			if (o[1].standard === false) {
				return false;
			}
		}

		return true;
	};

	const checkAllAuxIndeterminate = (): boolean => {
		for(const o of Object.entries(auxFormData)) {
			if (o[1].standard === true) {
				return !checkAllAuxForms();
			}
		}

		return false;
	};

	const handleVfaAllChange = (e: ChangeEvent<HTMLInputElement>) => {
		let toSet: boolean;
		if(e.target.checked) {
			toSet = true;
		} else if (!e.target.indeterminate) {
			toSet = false;
		} else {
			return;
		}

		const obj: AuxFormData = JSON.parse(JSON.stringify(DefaultSettings.auxForms));
		Object.keys(obj).forEach(key => {
			obj[key as keyof AuxFormData].standard = toSet;
		});

		setAuxFormData(obj);
	};

	const handleVfaExclusiveChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCurrentSettings({...currentSettings, exclusiveAux: e.target.checked});
	};

	const getColumnSpacingWidth = (): string => {
		if (width <= 320) return "0px";

		return (width - 320)/4 + "px";
	};

	const getColumnSpacingWidthFullMode = (): string => {
		return "30px";
	};

	const shouldSwitchGridToSlim = (): boolean => {
		return width < 710;
	};


	const vtSection = () => {
		return (
			<div className="checkbox-group">
				<FormLabel className="form-subtitle">Verb Type</FormLabel>
				<FormGroup className="shift-group-right">
					<span>
						<FormControlLabel
							control={
								<Checkbox checked={verbTypeData.vtIrregular}
									onChange={handleVtChange}
									name="vtIrregular"
									inputRef={vtInputRef}/>
							}
							label="Irregular"
						/>
						<FormControlLabel
							control={
								<Checkbox checked={verbTypeData.vtIchidan}
									onChange={handleVtChange}
									name="vtIchidan"/>
							}
							label="Ichidan"
						/>
					</span>
					<div className="godan-checkbox">
						<FormControlLabel
							control={
								<Checkbox checked={checkAllVt()}
									indeterminate={checkIndeterminateVt()}
									onChange={handleGodanChange}
									name="vtGodan"/>
							}
							label="Godan"
						/>
					</div>
					<div className="checkbox-parent-group">
						<div>
							<div>
								<FormControlLabel
									control={
										<Checkbox checked={verbTypeData.vtU}
											onChange={handleVtChange}
											name="vtU"
										/>
									}
									label="う"
								/>
							</div>
							<div>
								<FormControlLabel
									control={
										<Checkbox checked={verbTypeData.vtKu}
											onChange={handleVtChange}
											name="vtKu"
										/>
									}
									label="く"
								/>
							</div>
							<div>
								<FormControlLabel
									control={
										<Checkbox checked={verbTypeData.vtGu}
											onChange={handleVtChange}
											name="vtGu"
										/>
									}
									label="ぐ"
								/>
							</div>
						</div>
						<div>
							<div>
								<FormControlLabel
									control={
										<Checkbox checked={verbTypeData.vtSu}
											onChange={handleVtChange}
											name="vtSu"
										/>
									}
									label="す"
								/>
							</div>
							<div>
								<FormControlLabel
									control={
										<Checkbox checked={verbTypeData.vtTsu}
											onChange={handleVtChange}
											name="vtTsu"
										/>
									}
									label="つ"
								/>
							</div>
							<div>
								<FormControlLabel
									control={
										<Checkbox checked={verbTypeData.vtNu}
											onChange={handleVtChange}
											name="vtNu"
										/>
									}
									label="ぬ"
								/>
							</div>
						</div>
						<div>
							<div>
								<FormControlLabel
									control={
										<Checkbox checked={verbTypeData.vtBu}
											onChange={handleVtChange}
											name="vtBu"
										/>
									}
									label="ぶ"
								/>
							</div>
							<div>
								<FormControlLabel
									control={
										<Checkbox checked={verbTypeData.vtMu}
											onChange={handleVtChange}
											name="vtMu"
										/>
									}
									label="む"
								/>
							</div>
							<div>
								<FormControlLabel
									control={
										<Checkbox checked={verbTypeData.vtRu}
											onChange={handleVtChange}
											name="vtRu"
										/>
									}
									label="る"
								/>
							</div>
						</div>
					</div>
				</FormGroup>
			</div>
		);
	};

	const vfCheckboxParentGroup = (name: FormNames, label: string, first = false) => {
		return (
			<div className={ showVfSubOptions && shouldSwitchGridToSlim()? "slim-mode-parent" : "" }>
				<FormGroup>
					<span className={showVfSubOptions && shouldSwitchGridToSlim()? "" : "checkbox-parent-group"}>
						<span className="parent-checkbox vf-parent-column">
							<FormControlLabel
								control={
									<Checkbox checked={checkAllSubOptions(name)}
										indeterminate={checkIndeterminateVf(name)}
										onChange={(e) => handleVfChangeParent(e, name)}
										name={name}
										inputRef={first? vfInputRef : null}/>
								}
								label={label}
							/>
						</span>
						{showVfSubOptions && shouldSwitchGridToSlim() && <div style={{display: "flex"}}>
							<span>
								<div className="vf-first-column">
									{"plain" in verbFormData[name] &&
										<FormControlLabel
											control={
												<Checkbox checked={verbFormData[name as  WithPlainForms].plain}
													onChange={(e) => handleVfChange(e, name)}
													name="plain"/>
											}
											label={VerbFormSubTypeDisplayNames.plain}
										/>
									}
								</div>
								<div className="vf-first-column">
									{"polite" in verbFormData[name] &&
										<FormControlLabel
											control={
												<Checkbox checked={verbFormData[name as WithPoliteForms].polite}
													onChange={(e) => handleVfChange(e, name)}
													name="polite"/>
											}
											label={VerbFormSubTypeDisplayNames.polite}
										/>
									}
								</div>
							</span>
							<span style={{width: getColumnSpacingWidth()}}></span>
							<span>
								<div className="vf-second-column">
									{"negativePlain" in verbFormData[name] &&
										<FormControlLabel
											control={
												<Checkbox checked={verbFormData[name as WithNegativeForms].negativePlain}
													onChange={(e) => handleVfChange(e, name)}
													name="negativePlain"
												/>
											}
											label={VerbFormSubTypeDisplayNames.negative + " " + VerbFormSubTypeDisplayNames.plain}
										/>
									}
								</div>
								<div className="vf-second-column">
									{"negativePolite" in verbFormData[name] &&
										<FormControlLabel
											control={
												<Checkbox checked={verbFormData[name as WithNegativePoliteForms].negativePolite}
													onChange={(e) => handleVfChange(e, name)}
													name="negativePolite"/>
											}
											label={VerbFormSubTypeDisplayNames.negative + " " + VerbFormSubTypeDisplayNames.polite}
										/>
									}
								</div>
							</span>
						</div>}
						{showVfSubOptions && shouldSwitchGridToSlim() && <div className="line-break-small"></div>}
						{showVfSubOptions && !shouldSwitchGridToSlim() && <div>
							<span style={{width: getColumnSpacingWidthFullMode()}}></span>
							<span className="children-checkboxes">
								<span className="vf-first-column">
									{"plain" in verbFormData[name] &&
										<FormControlLabel
											control={
												<Checkbox checked={verbFormData[name as  WithPlainForms].plain}
													onChange={(e) => handleVfChange(e, name)}
													name="plain"/>
											}
											label={VerbFormSubTypeDisplayNames.plain}
										/>
									}
								</span>
								<span className="vf-second-column">
									{"polite" in verbFormData[name] &&
										<FormControlLabel
											control={
												<Checkbox checked={verbFormData[name as WithPoliteForms].polite}
													onChange={(e) => handleVfChange(e, name)}
													name="polite"/>
											}
											label={VerbFormSubTypeDisplayNames.polite}
										/>
									}
								</span>
								<span className="vf-third-column">
									{"negativePlain" in verbFormData[name] &&
										<FormControlLabel
											control={
												<Checkbox checked={verbFormData[name as WithNegativeForms].negativePlain}
													onChange={(e) => handleVfChange(e, name)}
													name="negativePlain"
												/>
											}
											label={VerbFormSubTypeDisplayNames.negative + " " + VerbFormSubTypeDisplayNames.plain}
										/>
									}
								</span>
								<span className="vf-fourth-column">
									{"negativePolite" in verbFormData[name] &&
										<FormControlLabel
											control={
												<Checkbox checked={verbFormData[name as WithNegativePoliteForms].negativePolite}
													onChange={(e) => handleVfChange(e, name)}
													name="negativePolite"/>
											}
											label={VerbFormSubTypeDisplayNames.negative + " " + VerbFormSubTypeDisplayNames.polite}
										/>
									}
								</span>
							</span>
						</div>}
					</span>
				</FormGroup>
			</div>
		);
	};

	const vfAllCheckboxParentGroup = () => {
		return (
			<div className={ showVfSubOptions && shouldSwitchGridToSlim()? "slim-mode-parent" : "" }>
				<FormGroup>
					<span className={showVfSubOptions && shouldSwitchGridToSlim()? "" : "checkbox-parent-group"}>
						<span className="parent-checkbox vf-parent-column">
							<FormControlLabel
								control={
									<Checkbox checked={checkAllForms()}
										indeterminate={checkAllIndeterminate()}
										onChange={handleVfAllChange}
										name="vfAll"/>
								}
								label="All"
							/>
						</span>
						{showVfSubOptions && shouldSwitchGridToSlim() && <div style={{display: "flex"}}>
							<span>
								<div className="vf-first-column">
									<FormControlLabel
										control={
											<Checkbox checked={checkAllSubsOfType("plain")}
												indeterminate={checkAllSubsOfTypeIndeterminate("plain")}
												onChange={(e) => handleVfAllSubOfTypeChange(e, "plain")}
												name="vfPlainAll"/>
										}
										label="Plain"
									/> 
								</div>
								<div className="vf-first-column">
									<FormControlLabel
										control={
											<Checkbox checked={checkAllSubsOfType("polite")}
												indeterminate={checkAllSubsOfTypeIndeterminate("polite")}
												onChange={(e) => handleVfAllSubOfTypeChange(e, "polite")}
												name="vfPoliteAll"/>
										}
										label="Polite"
									/> 
								</div>
							</span>
							<span style={{width: getColumnSpacingWidth()}}></span>
							<span>
								<div className="vf-second-column">
									<FormControlLabel
										control={
											<Checkbox checked={checkAllSubsOfType("negativePlain")}
												indeterminate={checkAllSubsOfTypeIndeterminate("negativePlain")}
												onChange={(e) => handleVfAllSubOfTypeChange(e, "negativePlain")}
												name="vfNegativePlainAll"/>
										}
										label="Negative Plain"
									/> 
								</div>
								<div className="vf-second-column">
									<FormControlLabel
										control={
											<Checkbox checked={checkAllSubsOfType("negativePolite")}
												indeterminate={checkAllSubsOfTypeIndeterminate("negativePolite")}
												onChange={(e) => handleVfAllSubOfTypeChange(e, "negativePolite")}
												name="vfNegativePoliteAll"/>
										}
										label="Negative Polite"
									/> 
								</div>
							</span>
						</div>}
						{showVfSubOptions && !shouldSwitchGridToSlim() && <span className="children-checkboxes">
							<span className="vf-first-column">
								<FormControlLabel
									control={
										<Checkbox checked={checkAllSubsOfType("plain")}
											indeterminate={checkAllSubsOfTypeIndeterminate("plain")}
											onChange={(e) => handleVfAllSubOfTypeChange(e, "plain")}
											name="vfPlainAll"/>
									}
									label="All"
								/> 
							</span>
							<span className="vf-second-column">
								<FormControlLabel
									control={
										<Checkbox checked={checkAllSubsOfType("polite")}
											indeterminate={checkAllSubsOfTypeIndeterminate("polite")}
											onChange={(e) => handleVfAllSubOfTypeChange(e, "polite")}
											name="vfPoliteAll"/>
									}
									label="All"
								/> 
							</span>
							<span className="vf-third-column">
								<FormControlLabel
									control={
										<Checkbox checked={checkAllSubsOfType("negativePlain")}
											indeterminate={checkAllSubsOfTypeIndeterminate("negativePlain")}
											onChange={(e) => handleVfAllSubOfTypeChange(e, "negativePlain")}
											name="vfNegativePlainAll"/>
									}
									label="All"
								/> 
							</span>
							<span className="vf-fourth-column">
								<FormControlLabel
									control={
										<Checkbox checked={checkAllSubsOfType("negativePolite")}
											indeterminate={checkAllSubsOfTypeIndeterminate("negativePolite")}
											onChange={(e) => handleVfAllSubOfTypeChange(e, "negativePolite")}
											name="vfNegativePoliteAll"/>
									}
									label="All"
								/> 
							</span>
						</span>}
					</span>
				</FormGroup>
			</div>
		);
	};

	const vfaCheckboxParentGroup = (name: AuxFormNames, label: string, first = false) => {
		return (
			<div>
				<FormGroup>
					<span className={"checkbox-parent-group"}>
						<span className="parent-checkbox vfa-column">
							<FormControlLabel
								control={
									<Checkbox checked={auxFormData[name].standard}
										onChange={(e) => handleVfaChange(e, name)}
										name={name}
										inputRef={first? vfaInputRef : null}/>
								}
								label={label}
							/>
						</span>
					</span>
				</FormGroup>
			</div>
		);
	};

	const vfaAllCheckboxParentGroup = () => {
		return (
			<div>
				<FormGroup>
					<span className={"checkbox-parent-group"}>
						<span className="parent-checkbox vf-parent-column">
							<FormControlLabel
								control={
									<Checkbox checked={checkAllAuxForms()}
										indeterminate={checkAllAuxIndeterminate()}
										onChange={handleVfaAllChange}
										name="vfaAll"/>
								}
								label="All"
							/>
						</span>
					</span>
				</FormGroup>
			</div>
		);
	};

	const jlptVerbsN3N1 = () => {
		return (
			<span>
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
		);
	};


	const renderSettingsForm = () => {
		return (
			<Box sx={{ p: 1.5, border: "1px solid black", borderRadius: 2 }}>
				<form className="form settings-form" onSubmit={ handleSubmit } ref={formRef}>
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
								{currentSettings.testType === TestType.Amount && currentSettings.testTypeObject && <div className="amount-sub-form">
									<Field
										type={ FieldType.Number }
										ref={ wordAmountRef }
										staticData={ fieldData.wordAmount.staticData }
										valueSetter={ setNewWordAmount }/>
								</div>}
								{currentSettings.testType === TestType.Endless && <div className="endless-sub-form">
								</div>}
								{currentSettings.testType === TestType.Timed && <div className="timed-sub-form">
									<Field
										type={ FieldType.Number }
										ref={ timeLimitRef }
										staticData={ fieldData.timeLimit.staticData }
										valueSetter={ setNewTime }/>
								</div>}
							</div>
						</FormControl>
					</div>
					<div className="line-break"></div>
					<div>
						<FormControl component="fieldset" variant="standard" error={ verbTypeError || verbLevelError || verbTypeNoResultsError }>
							<FormLabel component="legend" className="form-title">Verb Settings</FormLabel>
							<div className="checkbox-group">
								<FormLabel className="form-subtitle">JLPT Level</FormLabel>
								<FormGroup className="shift-group-right">
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
										{formWidth >= 340 && 
											<span>
												{jlptVerbsN3N1()}
											</span>
										}
										{formWidth < 340 && 
											<div>
												{jlptVerbsN3N1()}
											</div>
										}
									</span>
								</FormGroup>
							</div>
							<FormHelperText className="helper-text">{ verbLevelError? "Select at least one" : "" }</FormHelperText>
							<div className="line-break-large"></div>
							{vtSection()}
							<FormHelperText className="helper-text">{ verbTypeError? "Select at least one" : ((verbTypeNoResultsError && !verbLevelError)? "These settings will give no verbs, select more options" : "") }</FormHelperText>
						</FormControl>
					</div>
					<div className="line-break-large"></div>
					<div>
						<FormControl component="fieldset" variant="standard" error={isVerbFormError() || isExclusiveAuxError()}>
							<FormLabel component="legend" className="form-title">Conjugation Settings</FormLabel>
							<div className="checkbox-group">
								<FormLabel className="form-subtitle">Verb Forms</FormLabel>
								<div className="line-break-small"></div>
								<FormGroup>
									<FormControlLabel style={{margin: "auto"}} control={
										<Switch checked={ showVfSubOptions } onChange={ handleVfSubOptionsChange }/>
									} label="Show sub-options"/>
								</FormGroup>
								<div className="line-break-small"></div>
								<div className={showVfSubOptions? (shouldSwitchGridToSlim()? "slim-mode-container" : "checkbox-grid-wide") : "checkbox-grid-slim"}>
									{vfAllCheckboxParentGroup()}
									<div className="line-break-small"></div>
									{showVfSubOptions && 
										<div>
											{vfCheckboxParentGroup("present", VerbFormDisplayNames.present, true)}
											{vfCheckboxParentGroup("past", VerbFormDisplayNames.past)}
											{vfCheckboxParentGroup("te", VerbFormDisplayNames.te)}
											{vfCheckboxParentGroup("tai", VerbFormDisplayNames.tai)}
											{vfCheckboxParentGroup("zu", VerbFormDisplayNames.zu)}
											{vfCheckboxParentGroup("volitional", VerbFormDisplayNames.volitional)}
											{vfCheckboxParentGroup("imperative", VerbFormDisplayNames.imperative)}
											{vfCheckboxParentGroup("baConditional", VerbFormDisplayNames.baConditional)}
											{vfCheckboxParentGroup("taraConditional", VerbFormDisplayNames.taraConditional)}
											{vfCheckboxParentGroup("stem", VerbFormDisplayNames.stem)}
										</div>
									}
									{!showVfSubOptions && 
										<div className="checkbox-parent-group">
											<div className="first-column">
												{vfCheckboxParentGroup("present", VerbFormDisplayNames.present, true)}
												{vfCheckboxParentGroup("past", VerbFormDisplayNames.past)}
												{vfCheckboxParentGroup("te", VerbFormDisplayNames.te)}
												{vfCheckboxParentGroup("tai", VerbFormDisplayNames.tai)}
												{vfCheckboxParentGroup("zu", VerbFormDisplayNames.zu)}
											</div>
											<div style={{width: getColumnSpacingWidth()}}></div>
											<div className="second-column">
												{vfCheckboxParentGroup("volitional", VerbFormDisplayNames.volitional)}
												{vfCheckboxParentGroup("imperative", VerbFormDisplayNames.imperative)}
												{vfCheckboxParentGroup("baConditional", VerbFormDisplayNames.baConditional)}
												{vfCheckboxParentGroup("taraConditional", VerbFormDisplayNames.taraConditional)}
												{vfCheckboxParentGroup("stem", VerbFormDisplayNames.stem)}
											</div>
										</div>
									}
								</div>
							</div>
							<FormHelperText className="helper-text">{ isVerbFormError()? "Select at least one" : "" }</FormHelperText>
							<div className="line-break-large"></div>
							<div className="checkbox-group" style={{margin: "auto"}}>
								<FormLabel className="form-subtitle">Additional Verb Forms</FormLabel>
								<div className="line-break"></div>
								<div className="checkbox-grid-slim">
									{vfaAllCheckboxParentGroup()}
									<div className="line-break-small"></div>
									<div className="checkbox-parent-group">
										<div className="first-column">
											{vfaCheckboxParentGroup("passive", AuxFormDisplayNames.passive)}
											{vfaCheckboxParentGroup("causative", AuxFormDisplayNames.causative)}
										</div>
										<div style={{width: getColumnSpacingWidth()}}></div>
										<div className="second-column">
											{vfaCheckboxParentGroup("potential", AuxFormDisplayNames.potential, true)}
											{vfaCheckboxParentGroup("chau", AuxFormDisplayNames.chau)}
										</div>
									</div>
									{vfaCheckboxParentGroup("causativePassive", AuxFormDisplayNames.causativePassive)}
								</div>
								<div className="line-break-small"></div>
								<div>
									<FormControlLabel
										control={
											<Checkbox checked={currentSettings.exclusiveAux}
												onChange={handleVfaExclusiveChange}
												name="vfaExclusive"
												inputRef={vfaExclusiveInputRef}/>
										}
										label="Additional Exclusive"
									/>
								</div>
							</div>
							<FormHelperText className="helper-text">Check to use additional verb combinations exclusively</FormHelperText>
							<FormHelperText className="helper-text">{isExclusiveAuxError()? "Select at least one additional form before checking this box" : ""}</FormHelperText>
						</FormControl>
					</div>
					<div className="line-break"></div>
					<div className="form-button-row">
						<Button variant="outlined" color="darkBlue" type="button" className="button-primary" onClick={ handleRestoreDefaults }>Restore Defaults</Button>
						<Button variant="contained" color="darkBlue" type="submit" className="button-primary">Start</Button>
					</div>
				</form>
			</Box>
		);
	};

	return (
		<div>
			{loadState === LoadState.Loading && <p className="status-text">Loading...</p>}
			{loadState === LoadState.Error && <p className="status-text">Sorry, the server is currently offline, please try again later</p>}
			{loadState === LoadState.Loaded && renderSettingsForm()}
		</div>
	);
};
 
export default SettingsForm;