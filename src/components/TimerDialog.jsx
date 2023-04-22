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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { formatTime } from "./Timer";
import { meditationSecondsAtom, restSecondsAtom } from "@/atoms/index";
import { useAtom } from "jotai";

export const TimerDialog = () => {
  const [meditationSeconds, setMeditationSeconds] = useAtom(
    meditationSecondsAtom
  );
  const [restSeconds, setRestSeconds] = useAtom(restSecondsAtom);

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

  useEffect(() => {
    const savedMeditationTime = Number(
      localStorage.getItem("meditationSeconds")
    );
    const savedRestTime = Number(localStorage.getItem("restSeconds"));

    if (savedMeditationTime) {
      setMeditationValue(savedMeditationTime);
    }

    if (savedRestTime) {
      setRestValue(savedRestTime);
    }
  }, [meditationSeconds, restSeconds]);

  const useDevMode = (m, r) => {
    saveMeditationSeconds(m);
    saveRestSeconds(r);
    setOpen(false);
  };

  const saveChanges = () => {
    saveMeditationSeconds(meditationValue);
    saveRestSeconds(restValue);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        className="flex h-auto justify-center text-cal-400"
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
        <div className="grid gap-4 py-4">
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
        </div>
        <DialogFooter>
          {process.env.NODE_ENV === "development" && (
            <>
              <Button
                className="text-xs"
                variant="secondary"
                onClick={() => useDevMode(2, 4)}
              >
                Use Dev
              </Button>
              <Button
                className="text-xs"
                variant="secondary"
                onClick={() => useDevMode(3, 6)}
              >
                Use 2nd Dev
              </Button>
            </>
          )}
          <Button onClick={() => saveChanges()}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
