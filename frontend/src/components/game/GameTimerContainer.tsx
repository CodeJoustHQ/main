import React, { useCallback, useEffect, useState } from 'react';
import { GameClock, GameTimer } from '../../api/GameTimer';
import getInstant from '../../api/Utility';
import ErrorMessage from '../core/Error';

type GameTimerProps = {
  gameTimer: GameTimer | null,
};

function GameTimerContainer(props: GameTimerProps) {
  const [currentClock, setCurrentClock] = useState<GameClock | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownStarted, setCountdownStarted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const startClock = useCallback((gameTimerParam: GameTimer) => {
    // Get current time here, find the difference, then begin countdown.
    getInstant().then((res) => {
      // Get the difference to end time minus one to match delay.
      let tempCountdown: number = (new Date(gameTimerParam.endTime).getTime()
        - new Date(res).getTime()) / 1000 - 1;
      setCountdownStarted(true);
      setInterval(() => {
        setCountdown(tempCountdown);
        tempCountdown -= 1;
      }, 1000);
    }).catch((err) => {
      // Set an error if the current instant could not be retrieved.
      setError(err.message);
    });
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
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}

export default GameTimerContainer;
