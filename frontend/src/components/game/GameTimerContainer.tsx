import React, { useCallback, useEffect, useState } from 'react';
import { GameClock, GameTimer } from '../../api/GameTimer';

type GameTimerProps = {
  gameTimer: GameTimer | null,
};

function GameTimerContainer(props: GameTimerProps) {
  const [currentClock, setCurrentClock] = useState<GameClock | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownStarted, setCountdownStarted] = useState<boolean>(false);

  const startClock = useCallback((gameTimerParam: GameTimer) => {
    // Get current time here, get difference, then begin countdown.
    let tempCountdown: number = (new Date(gameTimerParam.endTime).getTime()
      - new Date(gameTimerParam.startTime).getTime()) / 1000;
    setCountdownStarted(true);
    setInterval(() => {
      setCountdown(tempCountdown);
      tempCountdown -= 1;
    }, 1000);
  }, [setCountdown, setCountdownStarted]);

  useEffect(() => {
    // Set timer if applicable; otherwise, default of null to display loading.
    if (props.gameTimer && !countdownStarted) {
      startClock(props.gameTimer);
    } else if (!countdownStarted) {
      setCurrentClock(null);
    }
  }, [startClock, props, countdownStarted]);

  useEffect(() => {
    if (countdown && countdown > 0) {
      // Set minutes and its string.
      const minutes: number = Math.floor(countdown / 60);
      let minutesStr: string;
      if (minutes >= 10) {
        minutesStr = `${minutes}`;
      } else if (minutes > 0 && minutes < 10) {
        minutesStr = `0${minutes}`;
      } else {
        minutesStr = '00';
      }

      const seconds: number = Math.floor(countdown % 60);
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
  }, [countdown]);

  return (
    <div>
      Time:
      {' '}
      {(currentClock) ? `${currentClock.minutes}:${currentClock.seconds}` : 'Loading...'}
    </div>
  );
}

export default GameTimerContainer;
