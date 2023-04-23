import { useCallback, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, MoreVertical } from "lucide-react";
import { TimerDialog } from "./TimerDialog";
import {
  fullScreenAtom,
  meditationSecondsAtom,
  restSecondsAtom,
  timerSecondsAtom,
} from "@/atoms/index";
import { useAtom } from "jotai";

export const Timer = ({ fullScreenHandle }) => {
  const [, setFullScreen] = useAtom(fullScreenAtom);
  const [meditationSeconds, setMeditationSeconds] = useAtom(
    meditationSecondsAtom
  );
  const [restSeconds, setRestSeconds] = useAtom(restSecondsAtom);
  const [timerSeconds, setTimerSeconds] = useAtom(timerSecondsAtom);

  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(meditationSeconds);
  const [, setGlobalSeconds] = useAtom(meditationSecondsAtom);

  const updateSeconds = useCallback((seconds) => {
    setCurrentSeconds(seconds);
    setGlobalSeconds(seconds);
  }, [setCurrentSeconds, setGlobalSeconds]);

  // fetch the meditation and rest seconds from local storage
  useEffect(() => {
    const savedMeditationSeconds = Number(
      localStorage.getItem("meditationSeconds")
    );
    const savedRestSeconds = Number(localStorage.getItem("restSeconds"));

    if (savedMeditationSeconds) {
      setMeditationSeconds(savedMeditationSeconds);
      setRestSeconds(savedRestSeconds);
      updateSeconds(savedMeditationSeconds);
    }
  }, [updateSeconds]);

  // timer interval
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (currentSeconds === 1) {
          if (!isResting) {
            playDing();
            setIsResting(true);
            updateSeconds(restSeconds);
          } else {
            playDone();
            setIsResting(false);
            updateSeconds(meditationSeconds);
            setIsActive(false);
          }
        } else {
          const newSeconds = currentSeconds - 1;
          updateSeconds(newSeconds);
          setTimerSeconds(newSeconds); // Update the timerSecondsAtom
        }
      }, 1000);
    } else if (!isActive && currentSeconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, meditationSeconds, restSeconds, isResting, currentSeconds, updateSeconds]);


  const toggle = () => {
    isActive ? pause() : start();
  };

  const start = () => {
    if (getFullScreenTimerPermission()) {
      console.log(
        "full screen timer permission ",
        getFullScreenTimerPermission()
      );
      setFullScreen(true);
      fullScreenHandle.enter();
    }
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
  };

  const reset = () => {
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

  const textColor = function () {
    if (!isActive) return "text-cal-400";
    return isResting ? "text-yellow-300" : "text-green-500";
  };

  return (
    <div className="flex w-[160px] items-center justify-center rounded-full border border-cal-800 text-cal-400">
      <div className={textColor()}>{formatTime(currentSeconds)}</div>
      <div className="ml-2 flex space-x-4">
        <button onClick={toggle} className="rounded py-2 hover:text-cal-300">
          {isActive ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={reset} className="rounded py-2 hover:text-cal-300">
          <RotateCcw size={16} />
        </button>
        <TimerDialog />
      </div>
    </div>
  );
};

export const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
};

export const getFullScreenTimerPermission = () => (
  JSON.parse(localStorage.getItem("fullScreenTimerPermission"))
)
