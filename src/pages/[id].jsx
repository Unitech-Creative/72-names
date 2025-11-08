import { ReactSVG } from "react-svg";
import Layout from "../components/layout";
import { Container } from "@/components/layout/Container";
import clsx from "clsx";
import { useState } from "react";
import * as Icons from "lucide-react";
import { FormattedMessage } from "react-intl";
import { Language, appLocale } from "@/lib/language";
import { PronouncedAs } from "@/components/PronouncedAs";
import { Audio } from "@/components/Audio";
import {
  PrevButton,
  NextButton,
  ButtonNavigation,
  goToNextId,
  goToPreviousId,
} from "@/components/NameNavigation";
import { useSwipeable } from "react-swipeable";
import { useRouter } from "next/router";
import { Timer } from "../components/Timer";
import * as Atom from "@/atoms/index";
import { useAtom } from "jotai";
import { useFullScreenHandle } from "react-full-screen";
import { isIOS } from "react-device-detect";
import { useEffect } from "react";
import { getFullScreenTimerPermission } from "@/components/Timer"
import { FullScreenLayout } from "@/components/FullScreenLayout";
import HebrewName from "@/components/HebrewName";

function getData(id) {
  let { lang, Pronounced } = Language();
  const data = lang[String(id)];
  data.id = id;
  data.pronounced = Pronounced[String(id)];
  return data;
}

export default function Home({ id }) {
  const [iOS, setIOS] = useAtom(Atom.iOSAtom);
  id = parseInt(id);
  const data = getData(id);
  const imageCard = <ImageCard data={data} />;
  const fullScreenHandle = useFullScreenHandle();
  const [fullScreen, setFullScreen] = useAtom(Atom.fullScreenAtom);
  const [iOSFullScreen, setIOSFullScreen] = useAtom(Atom.iOSFullScreenAtom);
  const [developer] = useAtom(Atom.developerAtom);
  const [storageUpdated] = useAtom(Atom.storageUpdatedAtom);
  const [fullScreenTimerPermission, setfullScreenTimerPermission] = useState(false);

  

  useEffect(() => {
    setIOSFullScreen(iOS && fullScreen);
  }, [setIOSFullScreen, fullScreen, iOS]);

  useEffect(() => {
    setIOS(isIOS);
  }, [setIOS]);

  useEffect(() => {
    setfullScreenTimerPermission(
      getFullScreenTimerPermission()
    )

  }, [storageUpdated])

  const DeveloperTools  = () => {
    if( !developer ) return null;

    return (
      <div className="fixed top-0 right-0 bg-cal-200 px-2 py-1 text-xs text-black">
        <div className="grid grid-cols-2">
          <div>iOS: {iOS ? "true" : "false"}</div>
          <div>FS Permission: {fullScreenTimerPermission ? 'yes' : 'no'}</div>
        </div>
      </div>
    )
  }

  return (
    <Layout
      meta={{
        title: `#${data.id} - ${data.pronounced}`,
      }}
    >
      <Container className="w-full">
        <Audio />
        <DeveloperTools />
        <FullScreenLayout
          setFullScreen={setFullScreen}
          fullScreen={fullScreen}
          handle={fullScreenHandle}
          imageCard={imageCard}
          data={data}
        />

        <DesktopToolbar
          data={data}
          fullScreen={fullScreen}
          setFullScreen={setFullScreen}
          fullScreenHandle={fullScreenHandle}
        />

        <div className="grid-cols-2 space-x-1 lg:grid mt-5 lg:mt-0">
          <div className={clsx({ "hidden": fullScreen })}>
            <NameId_Purpose_Short data={data} />
            <Mobile
              fullScreen={fullScreen}
              setFullScreen={setFullScreen}
              fullScreenHandle={fullScreenHandle}
              imageCard={imageCard}
              data={data}
            />
            <Meditation data={data} />
          </div>

          <Desktop
            setFullScreen={setFullScreen}
            imageCard={imageCard}
            data={data}
          />
        </div>
      </Container>
    </Layout>
  );
}

function Desktop({ data, imageCard }) {
  return (
    <div className="hidden lg:block">
      <PronouncedAs pronounced={data.pronounced} />
      
      <HebrewName
        pronounced={data.pronounced}
        containerClassName="gap-0"
        dotClassName="h-16 w-16"
        charClassName="text-[14rem] leading-none"
        pairGapClassName="gap-4"
      />

    </div>
  );
}

function Mobile({
  data,
  imageCard,
  fullScreenHandle,
  fullScreen,
  setFullScreen,
}) {
  const [, setCommandsOpen] = useAtom(Atom.commandsOpenAtom);

  return (
    <>
      <div className="flex place-content-between items-center lg:hidden">
        <PrevButton id={data.id} />
        <div className="flex flex-col items-center gap-4">
          <PronouncedAs pronounced={data.pronounced} />
          <HebrewName
            pronounced={data.pronounced}
            containerClassName="gap-4"
            dotClassName="h-6 w-6"
            charClassName="text-7xl leading-none"
            pairGapClassName="gap-2"
          />
        </div>
        <NextButton id={data.id} />
      </div>

      <div className="fixed bottom-10 left-0  flex w-full place-content-center lg:hidden">
        <div className="z-[999] rounded-full border border-cal-300 bg-cal-900">
          <Timer mobile={true} fullScreenHandle={fullScreenHandle}>
            <ExpandButton
              fullScreenHandle={fullScreenHandle}
              fullScreen={fullScreen}
              setFullScreen={setFullScreen}
            />

            <button
              onClick={() => setCommandsOpen(true)}
              className="mt-0.5 p-2 font-serif text-xl font-bold text-cal-400"
            >
              72
            </button>
          </Timer>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const ids = Array.from({ length: 72 }, (_, i) => i + 1).map((id) => ({
    params: { id: id.toString() },
  }));

  return {
    paths: ids,
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const { id } = context.params;

  return {
    props: { id }, // will be passed to the page component as props
  };
}

function NameId_Purpose_Short({ data }) {
  return (
    <>
      <div className="mb-5 flex w-full font-serif text-2xl text-cal-200 md:text-3xl">
        <div className={`flex w-[80px]`}>
          #{data.id}
          <div className="ml-1.5 text-cal-700">
            <Icons.ChevronRight className="mt-1" />
          </div>
        </div>
        <div>{data.purpose}</div>
      </div>

      <div className={`my-5 w-full leading-6 text-cal-400`}>
        <div className={clsx("w-full", `md:pl-[80px]`)}>{data.short}</div>
      </div>
    </>
  );
}

function ExpandButton({ fullScreenHandle, setFullScreen }) {
  const [iOS] = useAtom(Atom.iOSAtom);
  const [, setIOSFullScreen] = useAtom(Atom.iOSFullScreenAtom);

  return (
    <button
      onClick={() => {
        setFullScreen(true);
        iOS ? setIOSFullScreen(true) : fullScreenHandle.enter();
      }}
    >
      <Icons.Expand className="h-5 text-cal-400" />
    </button>
  );
}

function DesktopToolbar({ data, fullScreen, setFullScreen, fullScreenHandle }) {
  return (

    <div className="flex place-content-end space-x-4 lg:mb-20">
      <div className="z-10 hidden space-x-4 lg:flex">
        <Timer fullScreenHandle={fullScreenHandle} />
        <ExpandButton
          fullScreenHandle={fullScreenHandle}
          fullScreen={fullScreen}
          setFullScreen={setFullScreen}
        />
        <ButtonNavigation id={data.id} />
      </div>
    </div>

  );
}

function Meditation({ data }) {
  return (
    <div className=" mt-12 mb-10 md:pl-[80px]">
      <h3 className="mb-5 font-serif text-2xl text-cal-300">
        <FormattedMessage id="meditation" defaultMessage="Meditation" messages={appLocale} />
      </h3>

      <div className={`my-5 leading-6 text-cal-400`}>{data.meditation}</div>
    </div>
  );
}

function ImageCard({ data }) {
  const config = {
    delta: 10, // min distance(px) before a swipe starts. *See Notes*
    preventScrollOnSwipe: false, // prevents scroll during swipe (*See Details*)
    trackTouch: true, // track touch input
    trackMouse: false, // track mouse input
    rotationAngle: 0, // set a rotation angle
    swipeDuration: 250, // allowable duration of a swipe (ms). *See Notes*
    touchEventOptions: { passive: true }, // options for touch listeners (*See Details*)
  };

  const router = useRouter();

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => goToNextId(data.id, router),
    onSwipedRight: (eventData) => goToPreviousId(data.id, router),
    ...config,
  });

  return (
    <div className="min-h-[130px] md:min-h-[350px] flex w-full justify-center" {...handlers}>
      <div>
        <Svg
          id={data.id}
          className="z-1 -mt-[20px] aspect-video w-[260px] md:-mt-[40px] md:w-[400px] lg:-mt-[50px] lg:w-[550px] xl:-mt-[100px] xl:w-[600px]"
        />
      </div>
    </div>
  );
}

function Svg({ id, className }) {
  const debug = false;

  return (
    <div
      href={String(id)}
      className={clsx(className, "relative", "fill-white", {
        "bg-sky-300": debug,
      })}
    >
      {debug && (
        <div className="absolute bottom-0 right-0 h-1/2 w-full bg-green-800"></div>
      )}

      <ReactSVG
        src={`/images/svgs/72-${id}.svg`}
        className="absolute top-0 left-0 -mt-[20px] w-full"
      />
      {debug && (
        <div className="absolute bottom-0 right-0 text-sm text-red-600">
          {id}
        </div>
      )}
    </div>
  );
}
