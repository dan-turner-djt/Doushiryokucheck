import { useEffect, useState } from "react";

export type TimerProps = {
  startingTime: number;
  timeUpFunction: () => void;
}

const Timer = ({startingTime, timeUpFunction}: TimerProps) => {
	const [currentTime, setCurrentTime] = useState<number>(startingTime);
	const [seconds, setSeconds] = useState<string>("");
	const [minutes, setMinutes] = useState<string>("");

	useEffect(() => {
		const secs = currentTime % 60;
		const mins = (currentTime - secs) / 60;
		setMinutes(String(mins));
		setSeconds(toSecondsString(secs, mins));

		if (currentTime === 0) {
			// Time up
			timeUpFunction();

		} else {
			// Decrement timer
			setTimeout(() => {
				setCurrentTime(currentTime - 1);
			}, 1000);
		}
	}, [currentTime, timeUpFunction]);

	const toSecondsString = (secs: number, mins: number):string => {
		if (mins > 0 && secs < 10) {
			return "0" + String(secs);
		}
		return String(secs);
	};

	const getTimeString = ():string => {
		return ((Number(minutes) > 0)? minutes + ":" : "") + seconds;
	};

	return (  
		<div className="timer">
			<p>{ getTimeString() }</p>
		</div>
	);
};
 
export default Timer;