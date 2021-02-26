import React, { useCallback, useEffect, useState } from 'react';
import { GameClock, GameTimer } from '../../api/GameTimer';

type GameTimerProps = {
  gameTimer: GameTimer | null,
};

function GameTimerContainer(props: GameTimerProps) {
  const [currentClock, setCurrentClock] = useState<GameClock | null>(null);

  // Calculate and set the new clock on the frontend.
  const calculateSetClock = useCallback((gameTimerParam: GameTimer) => {
    console.log(Date.now());
    console.log(new Date());
    console.log(new Date(gameTimerParam.startTime).getTime());
    console.log(new Date(gameTimerParam.endTime).getTime());
    console.log(new Date(gameTimerParam.endTime).getTime() - Date.now());
    const newCurrentClock = (new Date(gameTimerParam.endTime).getTime() - Date.now()) / 1000;
    if (newCurrentClock > 0) {
      // Set minutes and its string.
      const minutes: number = Math.floor(newCurrentClock / 60);
      let minutesStr: string;
      if (minutes >= 10) {
        minutesStr = `${minutes}`;
      } else if (minutes > 0 && minutes < 10) {
        minutesStr = `0${minutes}`;
      } else {
        minutesStr = '00';
      }

      const seconds: number = Math.floor(newCurrentClock % 60);
      let secondsStr: string;
      if (seconds >= 10) {
        secondsStr = `${seconds}`;
      } else if (seconds > 0 && seconds < 10) {
        secondsStr = `0${seconds}`;
      } else {
        secondsStr = '00';
      }

      setCurrentClock({
        minutes: minutesStr,
        seconds: secondsStr,
      });
    } else {
      // Set null to indicate that the timer has ended.
      setCurrentClock(null);
    }
  }, []);

  const updateClock = useCallback((gameTimerParam: GameTimer) => {
    setInterval(() => calculateSetClock(gameTimerParam), 1000);
  }, [calculateSetClock]);

  useEffect(() => {
    // Set timer if applicable; otherwise, default of null to display loading.
    if (props.gameTimer) {
      updateClock(props.gameTimer);
    } else {
      setCurrentClock(null);
    }
  }, [updateClock, props]);

  return (
    <div>
      Time:
      {' '}
      {(currentClock) ? `${currentClock.minutes}:${currentClock.seconds}` : 'Loading...'}
    </div>
  );
}

export default GameTimerContainer;
