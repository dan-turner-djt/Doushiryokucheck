import React, { useEffect, useState } from "react";

export type TimerProps = {
  startingTime: number;
  timeUpFunction: Function;
}

const Timer = (props: TimerProps) => {
  const [currentTime, setCurrentTime] = useState<number>(props.startingTime);
  const [seconds, setSeconds] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");

  useEffect(() => {
    setTimeValues(currentTime);

    if (currentTime === 0) {
      // Time up
      props.timeUpFunction();

    } else {
      // Decrement timer
      setTimeout(() => {
        setCurrentTime(currentTime - 1);
      }, 1000);
    }
  }, [currentTime]);

  const setTimeValues = (time: number) => {
    const secs = time % 60;
    const mins = (time - secs) / 60;
    setMinutes(String(mins));
    setSeconds(toSecondsString(secs, mins));
  }

  const toSecondsString = (secs: number, mins: number):string => {
    if (mins > 0 && secs < 10) {
      return "0" + String(secs);
    }
    return String(secs);
  }

  const getTimeString = ():string => {
    return ((Number(minutes) > 0)? minutes + ":" : "") + seconds;
  }

  return (  
    <div className="timer">
      <p>{ getTimeString() }</p>
    </div>
  );
}
 
export default Timer;