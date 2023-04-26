// default nextjs page

import ReactHowler from "react-howler";
import Layout from "@/components/layout";
import { Container } from "@/components/layout/Container";
import React from "react";
import { Button } from "@/components/ui/button"

import { useAtom } from "jotai";
import * as Atom from "@/atoms/index";

export default function SoundsPage() {

  const [startAudioPlayer, setStartPlayer] = useAtom(Atom.startAudioPlayerAtom);
  const [doneAudioPlayer, setDonePlayer] = useAtom(Atom.doneAudioPlayerAtom);

  React.useEffect(() => {

    if( !startAudioPlayer ) return
    startAudioPlayer.play()
    console.log("Audio Played")

  }, [startAudioPlayer])

  return (
    <Layout>
      <Container>
        <ReactHowler preload={true} playing={false} src="/audio/ding.mp3" ref={(ref) => (setStartPlayer(ref))} />
        <ReactHowler preload={true} playing={false} src="/audio/done.mp3" ref={(ref) => (setDonePlayer(ref))} />
        <Button onClick={() => startAudioPlayer.play() }>DING</Button>
        <Button onClick={() => doneAudioPlayer.play() }>DONE</Button>
      </Container>
    </Layout>
  );
}
