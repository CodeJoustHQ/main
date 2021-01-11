import React, { useCallback, useEffect, useState } from 'react';
import { GameClock, GameTimer } from '../../api/GameTimer';

type GameTimerProps = {
  gameTimer: GameTimer | null,
};

// This function refreshes the width of Monaco editor upon change in container size
function GameTimerContainer(props: GameTimerProps) {
  const [currentClock, setCurrentClock] = useState<GameClock | null>(null);

  // Calculate and set the new clock on the frontend.
  const calculateSetClock = useCallback((gameTimerParam: GameTimer) => {
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
    // Set timer if applicable; otherwise, default of 00:00.
    if (props.gameTimer) {
      updateClock(props.gameTimer);
    } else {
      setCurrentClock({
        minutes: '00',
        seconds: '00',
      });
    }
  }, [updateClock, props]);

  return (
    <div>
      Time:
      {' '}
      {(currentClock) ? currentClock.minutes : '00'}
      :
      {(currentClock) ? currentClock.seconds : '00'}
    </div>
  );
}

export default GameTimerContainer;