import * as Icons from "lucide-react";
import * as Atom from "../atoms";
import { useAtom } from "jotai";
import { FullScreen } from "react-full-screen";
import { formatTime } from "../components/Timer";
import { PronouncedAs } from "@/components/PronouncedAs";
import clsx from "clsx";

export const FullScreenLayout = function({
  handle,
  imageCard,
  data,
  setFullScreen,
  fullScreen,
}) {
  const [iOS] = useAtom(Atom.iOSAtom);
  const [currentSeconds] = useAtom(Atom.meditationSecondsAtom);
  const [isResting] = useAtom(Atom.isRestingAtom);
  const [timerActive] = useAtom(Atom.timerActiveAtom);

  const textColor = function () {
    return isResting ? "text-yellow-300" : "text-cal-400";
  };

  return (
    <FullScreen
      handle={handle}
      onChange={(bool) => setFullScreen(bool)}
      className={clsx("bg-cal-900 py-20", {
        hidden: !fullScreen,
      })}
    >
      <div className={clsx("flex w-full items-center", iOS ? "py-20" : "h-screen")} >
        <div className="flex w-full flex-col space-y-14">
          <PronouncedAs pronounced={data.pronounced} />
          {imageCard}

          {timerActive ? (
            <div className="flex flex-col place-items-center font-serif">
              <div className="rounded-full border border-cal-700 px-5 py-1 font-semibold ">
                <div className={`leading-6 ${textColor()}`}>
                  {formatTime(currentSeconds)}
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div className="flex w-full place-content-center">
            <button
              className="rounded-full bg-cal-100 p-2"
              onClick={() => {
                setFullScreen(false);
                handle.exit();
              }}
            >
              <Icons.Minimize2 className="h-4 w-4 text-cal-800" />
            </button>
          </div>
        </div>
      </div>
    </FullScreen>
  );
}
