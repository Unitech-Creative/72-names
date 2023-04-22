import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, MoreVertical } from "lucide-react";
import { TimerDialog } from "./TimerDialog";
import { meditationSecondsAtom, restSecondsAtom } from "@/atoms/index";
import { useAtom } from "jotai";

export const Timer = () => {
  const [meditationSeconds, setMeditationSeconds] = useAtom(
    meditationSecondsAtom
  );
  const [restSeconds, setRestSeconds] = useAtom(restSecondsAtom);

  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(meditationSeconds);

  useEffect(() => {
    const savedMeditationSeconds = Number(
      localStorage.getItem("meditationSeconds")
    );
    const savedRestSeconds = Number(localStorage.getItem("restSeconds"));

    if (savedMeditationSeconds) {
      setMeditationSeconds(savedMeditationSeconds);
      setRestSeconds(savedRestSeconds);
      setCurrentSeconds(savedMeditationSeconds);
    }
  }, [setCurrentSeconds, meditationSeconds, restSeconds]);

  useEffect(() => {
    let interval = null;
    let seconds = currentSeconds;

    if (isActive) {
      interval = setInterval(() => {
        setCurrentSeconds(seconds);
        if (seconds === 1) {
          if (!isResting) {
            playDing();
            setIsResting(true);
            setCurrentSeconds(restSeconds);
          } else {
            playDone();
            setIsResting(false);
            setIsActive(false); // Stop the timer after the rest is done
            setCurrentSeconds(meditationSeconds);
          }
        } else {
          seconds -= 1;
          setCurrentSeconds(seconds);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, meditationSeconds, restSeconds, isResting]);

  const toggle = () => {
    setIsActive(!isActive);
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

  return (
    <div className="flex w-[160px] items-center justify-center rounded-full border border-cal-800 text-cal-400">
      <div className={`${isResting ? "text-green-500" : ""}`}>
        {formatTime(currentSeconds)}
      </div>
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
