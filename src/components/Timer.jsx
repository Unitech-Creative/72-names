import { useCallback, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, MoreVertical } from "lucide-react";
import { TimerDialog } from "./TimerDialog";
import {
  fullScreenAtom,
  meditationSecondsAtom,
  restSecondsAtom,
  timerSecondsAtom,
  storageUpdatedAtom,
  isRestingAtom,
  iOSAtom,
  timerActiveAtom,
} from "@/atoms/index";
import { useAtom } from "jotai";

export const Timer = ({ fullScreenHandle, mobile, children }) => {
  const [iOS] = useAtom(iOSAtom);
  const [storageUpdated, setStorageUpdated] = useAtom(storageUpdatedAtom);
  const [, setFullScreen] = useAtom(fullScreenAtom);
  const [meditationSeconds, setMeditationSeconds] = useAtom(
    meditationSecondsAtom
  );
  const [restSeconds, setRestSeconds] = useAtom(restSecondsAtom);
  const [, setTimerSeconds] = useAtom(timerSecondsAtom);

  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useAtom(isRestingAtom);
  const [currentSeconds, setCurrentSeconds] = useState(meditationSeconds);
  const [, setGlobalSeconds] = useAtom(meditationSecondsAtom);
  const [, setTimerActive] = useAtom(timerActiveAtom);

  useEffect(() => {
    setTimerActive(isActive);
  }, [setTimerActive, isActive]);

  const updateSeconds = useCallback(
    (seconds) => {
      setCurrentSeconds(seconds);
      setGlobalSeconds(seconds);
    },
    [setCurrentSeconds, setGlobalSeconds]
  );

  // Wrap the initializeTimes function with useCallback
  const initializeTimes = useCallback(() => {
    const [mSeconds, rSeconds] = getTimes();
    setMeditationSeconds(mSeconds);
    setRestSeconds(rSeconds);
    updateSeconds(mSeconds);
  }, [setMeditationSeconds, setRestSeconds, updateSeconds]);

  const getTimes = function () {
    let mSeconds = Number(localStorage.getItem("meditationSeconds"));
    let rSeconds = Number(localStorage.getItem("restSeconds"));
    if (!mSeconds) mSeconds = 3 * 60;
    if (!rSeconds) rSeconds = 2.5 * 60;

    return [mSeconds, rSeconds];
  };

  // Run initializeTimes when the component is mounted
  useEffect(() => {
    initializeTimes();
  }, [initializeTimes]);

  // fetch the meditation and rest seconds from local storage
  useEffect(() => {
    if (storageUpdated) {
      initializeTimes();
      setStorageUpdated(false);
    }
  }, [storageUpdated, setStorageUpdated, initializeTimes]);

  // timer interval
  useEffect(() => {
    let interval = null;

    const stop = () => {
      setIsResting(false);
      initializeTimes();
      setIsActive(false);
      if (getFullScreenTimerPermission(iOS)) {
        setTimeout(() => {
          setFullScreen(false);
          if (!iOS) fullScreenHandle.exit();
        }, 1000);
      }
    };

    if (isActive) {
      interval = setInterval(() => {
        if (currentSeconds === 1) isResting ? playDone() : playDing();

        if (currentSeconds === 0) {
          if (!isResting) {
            setIsResting(true);
            updateSeconds(restSeconds);
          } else {
            stop();
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
  }, [
    isActive,
    meditationSeconds,
    restSeconds,
    isResting,
    currentSeconds,
    updateSeconds,
    setTimerSeconds,
    fullScreenHandle,
    setFullScreen,
    initializeTimes,
  ]);

  const toggle = () => {
    isActive ? pause() : start();
  };

  const start = () => {
    if (getFullScreenTimerPermission(iOS)) {
      setFullScreen(true);
      if (!iOS) fullScreenHandle.enter();
    }
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
  };

  const reset = () => {
    setIsActive(false);
    setIsResting(false);
    initializeTimes();
  };

  const playDing = () => {
    const audio = new Audio("/audio/ding.mp3");
    audio.play();
  };

  const playDone = () => {
    const audio = new Audio("/audio/done.mp3");
    audio.play();
  };

  const uiProps = {
    isActive,
    isResting,
    currentSeconds,
    toggle,
    reset,
    pause,
  };

  return mobile ? (
    <MobileUI {...uiProps} children={children} />
  ) : (
    <DesktopUI {...uiProps} />
  );
};

const textColor = function (isActive, isResting) {
  if (!isActive) return "text-cal-400";
  return isResting ? "text-yellow-300" : "text-green-500";
};

function MobileUI({
  isActive,
  isResting,
  currentSeconds,
  toggle,
  reset,
  pause,
  children,
}) {
  return (
    <div className="flex w-fit items-center justify-center rounded-full border border-cal-800 px-4 text-cal-400">
      <div className={textColor(isActive, isResting)}>
        {formatTime(currentSeconds)}
      </div>
      <div className="ml-2 flex space-x-4">
        <button onClick={toggle} className="rounded-full p-3 ">
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={reset} className="rounded-full p-1 ">
          <RotateCcw size={16} />
        </button>
        <TimerDialog pause={pause} />
        {children}
      </div>
    </div>
  );
}

function DesktopUI({
  isActive,
  isResting,
  currentSeconds,
  toggle,
  reset,
  pause,
}) {
  return (
    <div className="flex w-fit items-center justify-center rounded-full border border-cal-800 px-4 text-cal-400">
      <div className={textColor(isActive, isResting)}>
        {formatTime(currentSeconds)}
      </div>
      <div className="ml-2 flex space-x-4">
        <button onClick={toggle} className="rounded py-2 hover:text-cal-300">
          {isActive ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={reset} className="rounded py-2 hover:text-cal-300">
          <RotateCcw size={16} />
        </button>
        <TimerDialog pause={pause} />
      </div>
    </div>
  );
}

export const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
};

export const getFullScreenTimerPermission = (iOS) =>
  JSON.parse(localStorage.getItem("fullScreenTimerPermission"));
