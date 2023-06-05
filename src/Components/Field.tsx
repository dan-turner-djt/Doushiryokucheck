import React from "react";

export type StaticFieldData = {
  label: string,
  startingValue: number,
  required?: boolean,
  minimum?: number,
  maximum?: number,
}

export type FieldProps = {
  staticData: StaticFieldData;
  focus: boolean;
  valueSetter: (newVal: number, valid: boolean) => void;
}

export type FieldRef = {
  giveFocus: () => void;
  resetValue: () => void;
}

const Field = React.forwardRef<FieldRef, FieldProps>((props, ref) => {
  const [value, setValue] = React.useState<number>(props.staticData.startingValue);
  const [isValid, setIsValid] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => ({

    giveFocus() {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    resetValue() {
      setValue(props.staticData.startingValue);
      setIsValid(true);
    }
  }));

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal: number = Number(e.target.value);
    if (isNaN(newVal)) {
      return;
    }
    setValue(newVal);
    
    let valid = true;
    if (!checkAndSetValueIsValid(newVal)) {
      valid = false;
    }

    props.valueSetter(newVal, valid);
  }

  const checkAndSetValueIsValid = (newVal: number): boolean => {
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
  }

  return (
    <div className="field">
      <label className="field-label">{ props.staticData.label }</label>
      <input ref={ inputRef } value={ value } onChange={ handleValueChange }></input>
      {!isValid && <label className="field-error-label">{ errorMessage }</label>}
    </div>
  );
});
 
export default Field;