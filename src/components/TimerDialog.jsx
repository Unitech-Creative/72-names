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
import { useState } from "react";
import { formatTime } from "./Timer";


export const TimerDialog = () => {
  const [meditationValue, setMeditationValue] = useState(3 * 60);
  const [restValue, setRestValue] = useState(2.5 * 60);
  const maxTime = 30 * 60;

  return (
    <Dialog>
      <DialogTrigger asChild className="flex justify-center h-auto text-cal-400">
        <MoreVertical size={16} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogDescription>
            Make changes to your meditation timer here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-5">
            <Label htmlFor="name" className="flex place-content-between">
              Meditation Time
              <div>{formatTime(meditationValue)}</div>
            </Label>
            <div>
              <Slider defaultValue={[meditationValue]} min={30} max={maxTime} step={30} onValueChange={(v) => setMeditationValue(v)} />
            </div>
          </div>
          <div className="flex flex-col space-y-5">
            <Label htmlFor="username" className="flex place-content-between">
              Rest Time
              <div>{formatTime(restValue)}</div>
            </Label>
            <div>
              <Slider defaultValue={[restValue]} min={30} max={maxTime} step={30} onValueChange={(v) => setRestValue(v)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
