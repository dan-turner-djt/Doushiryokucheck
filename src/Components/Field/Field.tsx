import { ChangeEvent, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { TextField } from "@mui/material";

export const enum FieldType {
	String, Number
}

export type StaticFieldData = {
  label: string,
  startingValue: number | string,
  required?: boolean,
  minimum?: number,
  maximum?: number,
}

export type FieldProps = {
	type: FieldType,
  staticData: StaticFieldData,
  valueSetter: (newVal: string, valid: boolean) => void
}

export type FieldRef = {
  giveFocus: () => void;
  resetValue: () => void;
}

const Field = forwardRef<FieldRef, FieldProps>((props, ref) => {
	const [value, setValue] = useState<string>(String(props.staticData.startingValue));
	const [isValid, setIsValid] = useState<boolean>(true);
	const [errorMessage, setErrorMessage] = useState<string>("");

	const inputRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(ref, () => ({
		giveFocus() {
			if (inputRef.current) {
				inputRef.current.focus();
			}
		},
		resetValue() {
			setValue(String(props.staticData.startingValue));
			setIsValid(true);
		}
	}));

	const handleStringValueChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newVal = e.target.value;
		setValue(e.target.value);
    
		let valid = true;
		if (!checkAndSetStringValueIsValid(newVal)) {
			valid = false;
		}

		props.valueSetter(newVal, valid);
	};

	const handleNumberValueChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newVal = Number(e.target.value);
		if (isNaN(newVal)) {
			return;
		}
		setValue(e.target.value);
    
		let valid = true;
		if (!checkAndSetNumberValueIsValid(newVal)) {
			valid = false;
		}

		props.valueSetter(String(newVal), valid);
	};

	const checkAndSetStringValueIsValid = (newVal: string): boolean => {
		setIsValid(true);
		return true;
	};

	const checkAndSetNumberValueIsValid = (newVal: number): boolean => {
		if (props.staticData.minimum && newVal < props.staticData.minimum) {
			setIsValid(false);
			setErrorMessage("Value cannot be lower than " + props.staticData.minimum);
			return false;
		}
		if (props.staticData.maximum && newVal > props.staticData.maximum) {
			setIsValid(false);
			setErrorMessage("Value cannot be greater than " + props.staticData.maximum);
			return false;
		}

		setIsValid(true);
		return true;
	};

	return (
		<div className="field">
			{props.type === FieldType.String &&
				<TextField
					label={props.staticData.label}
					variant="outlined"
					value={value}
					onChange={handleStringValueChange}
					error={!isValid}
					required={props.staticData.required}
					helperText={!isValid ? errorMessage : ""}
					inputRef={inputRef}/>
			}
			{props.type === FieldType.Number &&
				<TextField
					label={props.staticData.label}
					type="number"
					variant="outlined"
					value={value}
					onChange={handleNumberValueChange}
					error={!isValid}
					required={props.staticData.required}
					helperText={!isValid ? errorMessage : ("Enter a number between " + props.staticData.minimum + " and " + props.staticData.maximum + " inclusive")}
					inputRef={inputRef}/>
			}
		</div>
	);
});
Field.displayName = "Field"; 

export default Field;