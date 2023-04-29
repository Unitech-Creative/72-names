import { useCallback, useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { TimerDialog } from "./TimerDialog";
import * as Atom from "@/atoms/index";
import { useAtom } from "jotai";

export const Timer = ({ fullScreenHandle, mobile, children }) => {
  const [iOS] = useAtom(Atom.iOSAtom);
  const [storageUpdated, setStorageUpdated] = useAtom(Atom.storageUpdatedAtom);
  const [, setFullScreen] = useAtom(Atom.fullScreenAtom);
  const [meditationSeconds, setMeditationSeconds] = useAtom(Atom.
    meditationSecondsAtom
  );
  const [restSeconds, setRestSeconds] = useAtom(Atom.restSecondsAtom);
  const [, setTimerSeconds] = useAtom(Atom.timerSecondsAtom);

  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useAtom(Atom.isRestingAtom);
  const [currentSeconds, setCurrentSeconds] = useState(meditationSeconds);
  const [, setGlobalSeconds] = useAtom(Atom.meditationSecondsAtom);
  const [, setTimerActive] = useAtom(Atom.timerActiveAtom);
  const [startAudioPlayer] = useAtom(Atom.startAudioPlayerAtom);
  const [doneAudioPlayer] = useAtom(Atom.doneAudioPlayerAtom);


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
      if (getFullScreenTimerPermission()) {
        setTimeout(() => {
          setFullScreen(false);
          if (!iOS) fullScreenHandle.exit();
        }, 1000);
      }
    };

    if (isActive) {
      interval = setInterval(() => {
        if (currentSeconds === 1) isResting ? playDoneAudio() : playStartAudio();

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
    if (getFullScreenTimerPermission()) {
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

  const playStartAudio = () => {
    startAudioPlayer.play();
  };

  const playDoneAudio = () => {
    doneAudioPlayer.play();
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
          {isActive ? <Icons.Pause size={24} /> : <Icons.Play size={24} />}
        </button>
        <button onClick={reset} className="rounded-full p-1 ">
          <Icons.RotateCcw size={16} />
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
          {isActive ? <Icons.Pause size={16} /> : <Icons.Play size={16} />}
        </button>
        <button onClick={reset} className="rounded py-2 hover:text-cal-300">
          <Icons.RotateCcw size={16} />
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

export const getFullScreenTimerPermission = () =>
  JSON.parse(localStorage.getItem("fullScreenTimerPermission"));
