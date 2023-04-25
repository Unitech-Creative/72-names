import { Slider } from "@/components/ui/slider";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"

import { useState, useEffect } from "react";
import { formatTime } from "./Timer";
import { iOSAtom, meditationSecondsAtom, restSecondsAtom, storageUpdatedAtom } from "@/atoms/index";
import { useAtom } from "jotai";
import { getFullScreenTimerPermission } from "./Timer";

export const TimerDialog = ({pause}) => {
  const [iOS] = useAtom(iOSAtom)
  const [, setStorageUpdated] = useAtom(storageUpdatedAtom);
  const [meditationSeconds, setMeditationSeconds] = useAtom(
    meditationSecondsAtom
  );
  const [restSeconds, setRestSeconds] = useAtom(restSecondsAtom);
  const [fullScreenPermission, setFullScreenPermission] = useState(false);

  const [open, setOpen] = useState(false);
  const [meditationValue, setMeditationValue] = useState(3 * 60);
  const [restValue, setRestValue] = useState(2.5 * 60);
  const maxTime = 30 * 60;

  const saveMeditationSeconds = (seconds) => {
    setMeditationSeconds(seconds);
    localStorage.setItem("meditationSeconds", seconds);
  };

  const saveRestSeconds = (seconds) => {
    setRestSeconds(seconds);
    localStorage.setItem("restSeconds", seconds);
  };

  const saveFullScreenPermission = (permission) => {
    localStorage.setItem("fullScreenTimerPermission", Boolean(permission));
  }

  useEffect(() => {
    const savedMeditationTime = Number(
      localStorage.getItem("meditationSeconds")
    );
    const savedRestTime = Number(localStorage.getItem("restSeconds"));
    const savedHasFullScreenPermission = getFullScreenTimerPermission(iOS);

    if (savedMeditationTime) {
      setMeditationValue(savedMeditationTime);
    }

    if (savedRestTime) {
      setRestValue(savedRestTime);
    }

    if (savedHasFullScreenPermission) {
      setFullScreenPermission(savedHasFullScreenPermission);
    }

  }, [meditationSeconds, restSeconds]);

  const update = (m,r) => {
    saveMeditationSeconds(m);
    saveRestSeconds(r);
    setStorageUpdated(true);
  }

  const useDevMode = (m, r) => {
    update(m, r)
    setOpen(false);
  };

  const saveChanges = () => {
    update(meditationValue, restValue)
    saveFullScreenPermission(fullScreenPermission)
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        className="flex h-auto justify-center text-cal-400 cursor-pointer"
        onClick={() => { pause() } }
      >
        <MoreVertical size={16} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogDescription>
            Make changes to your meditation timer here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid space-y-6 py-4">
          <div className="flex flex-col space-y-5">
            <Label htmlFor="name" className="flex place-content-between">
              Meditation Time
              <div>{formatTime(meditationValue)}</div>
            </Label>
            <div>
              <Slider
                defaultValue={[meditationValue]}
                min={30}
                max={maxTime}
                step={30}
                onValueChange={(v) => setMeditationValue(v)}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-5">
            <Label htmlFor="username" className="flex place-content-between">
              Rest Time
              <div>{formatTime(restValue)}</div>
            </Label>
            <div>
              <Slider
                defaultValue={[restValue]}
                min={30}
                max={maxTime}
                step={30}
                onValueChange={(v) => setRestValue(v)}
              />
            </div>
          </div>
          {!iOS && (
            <div className="flex flex-col space-y-5">
              <div className="flex place-content-between">
                <Label htmlFor="fullscreen-mode">Enter Fullscreen When Timer Starts</Label>
                <Switch checked={fullScreenPermission} onCheckedChange={(e) => {setFullScreenPermission(e)} } id="fullscreen-mode" />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          {process.env.NODE_ENV === "development" && (
            <>
              <Button
                className="text-xs"
                variant="secondary"
                onClick={() => useDevMode(2, 4)}
              >
                2/4
              </Button>
              <Button
                className="text-xs"
                variant="secondary"
                onClick={() => useDevMode(3, 6)}
              >
                3/6
              </Button>
              <Button
                className="text-xs"
                variant="secondary"
                onClick={() => useDevMode(3*60, 2.5*60)}
              >
                3m / 2.5m
              </Button>
            </>
          )}
          <Button onClick={() => saveChanges()}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
