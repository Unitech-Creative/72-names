import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, MoreVertical } from "lucide-react";
import {TimerDialog} from "./TimerDialog";

export const Timer = ({ seconds: initialWorkSeconds, rest }) => {
  const initialRestSeconds = rest;
  const [seconds, setSeconds] = useState(initialWorkSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => {
          if (seconds === 1) {
            if (!isResting) {
              playDing();
            } else {
              playDone();
            }
          }
          if (seconds === 0) {
            if (!isResting) {
              setIsResting(true);
              return initialRestSeconds;
            } else {
              setIsActive(false);
              setIsResting(false);
              return initialWorkSeconds;
            }
          }
          return seconds - 1;
        });
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(initialWorkSeconds);
    setIsActive(false);
    setIsResting(false);
  };

  const playDing = () => {
    const audio = new Audio("/audio/ding.mp3");
    audio.play();
  };

  const playDone = () => {
    const audio = new Audio("/audio/done.mp3");
    audio.play();
  };

  const handleMore = () => {
    alert("💕 More Clicked");
  };

  return (
    <div className="flex w-[160px] items-center justify-center rounded-full border border-cal-800 text-cal-400">
      <div className={`${isResting ? "text-green-500" : ""}`}>
        {formatTime(seconds)}
      </div>
      <div className="ml-2 flex space-x-4">
        <button onClick={toggle} className="rounded py-2 hover:text-cal-300">
          {isActive ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={reset} className="rounded py-2 hover:text-cal-300">
          <RotateCcw size={16} />
        </button>
        <TimerDialog />
        {/* <button onClick={handleMore}>
          <MoreVertical size={16} />
        </button> */}
      </div>
    </div>
  );
};

export const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
};
