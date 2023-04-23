import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Minimize2 } from "lucide-react";

export const FullScreenLayout = function({
  handle,
  timer,
  imageCard,
  data,
  setFullScreen,
  fullScreen,
}) {
  const [currentSeconds] = useAtom(meditationSecondsAtom);
  const [isResting, setIsResting] = useAtom(isRestingAtom);

  const textColor = function () {
    return isResting ? "text-yellow-300" : "text-cal-400";
  };

  return (
    <FullScreen
      handle={handle}
      onChange={(bool) => setFullScreen(bool)}
      className={clsx("bg-cal-900", {
        hidden: !fullScreen,
      })}
    >
      {/* <div className="flex flex-col h-screen text-white"> */}

      <div className="flex h-screen items-center">
        <div className="w-full">
          <PronouncedAs data={data} />
          {imageCard}

          <div className="my-10 flex flex-col place-items-center font-serif">
            <div className="rounded-full border border-cal-700 px-5 py-1 font-semibold ">
              <div className={`leading-6 ${textColor()}`}>
                {formatTime(currentSeconds)}
              </div>
            </div>
          </div>

          <div className="flex w-full place-content-center">
            <button
              className="rounded-full bg-cal-100 p-2"
              onClick={() => { setFullScreen(false); handle.exit(); } }
            >
              <Minimize2 className="h-4 w-4 text-cal-800" />
            </button>
          </div>
        </div>
      </div>
      {/* </div> */}
    </FullScreen>
  );
}
