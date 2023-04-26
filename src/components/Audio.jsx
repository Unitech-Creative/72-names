import React from "react";
import * as Atom from "@/atoms/index";
import ReactHowler from "react-howler";
import { useAtom } from "jotai";

export const Audio = () => {

  const [startAudioPlayer, setStartPlayer] = useAtom(Atom.startAudioPlayerAtom);
  const [doneAudioPlayer, setDonePlayer] = useAtom(Atom.doneAudioPlayerAtom);

  // React.useEffect(() => {

  //   if( !startAudioPlayer ) return

  //   startAudioPlayer.play()
  //   console.log("Audio Played")

  // }, [startAudioPlayer])


  return (
    <>
      <ReactHowler preload={true} playing={false} src="/audio/ding.mp3" ref={(ref) => (setStartPlayer(ref))} />
      <ReactHowler preload={true} playing={false} src="/audio/done.mp3" ref={(ref) => (setDonePlayer(ref))} />
    </>

  )
}
