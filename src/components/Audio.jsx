import React from "react";
import * as Atom from "@/atoms/index";
import ReactHowler from "react-howler";
import { useAtom } from "jotai";

export const Audio = () => {

  const [, setStartPlayer] = useAtom(Atom.startAudioPlayerAtom);
  const [, setDonePlayer] = useAtom(Atom.doneAudioPlayerAtom);

  return (
    <>
      <ReactHowler preload={true} playing={false} src="/audio/ding.mp3" ref={(ref) => (setStartPlayer(ref))} />
      <ReactHowler preload={true} playing={false} src="/audio/done.mp3" ref={(ref) => (setDonePlayer(ref))} />
    </>

  )
}
