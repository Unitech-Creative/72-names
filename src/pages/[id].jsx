import { ReactSVG } from "react-svg";
import Layout from "../components/layout";
import clsx from "clsx";
import React from "react";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Language } from "@/lib/language";
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

function getData(id) {
  let { locale, lang } = Language();
  const data = lang[String(id)];
  data.id = id;
  return data;
}

export default function Home({ id }) {
  id = parseInt(id);
  const data = getData(id);
  const imageCard = <ImageCard data={data} />;
  const timer = <Timer />;

  return (
    <Layout>
      <Container>
        <div className="rounded-lg border border-cal-700 p-3 md:p-4 lg:mt-10 lg:p-10">
          <HeaderWithNav data={data} timer={timer} />

          <div className="grid-cols-2 space-x-1 lg:grid">
            <div>
              <NameHeader data={data} />

              <div className="flex place-content-between items-center lg:hidden ">
                <PrevButton id={id} />
                {imageCard}
                <NextButton id={id} />
              </div>
              <div className="mt-10 -mb-10 flex w-full place-content-end lg:hidden">
                {timer}
              </div>
              <Meditation data={data} />
            </div>
            <div className="hidden lg:block">{imageCard}</div>
          </div>
        </div>
      </Container>
    </Layout>
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

function NameHeader({ data }) {
  return (
    <>
      <div className="mb-5 flex w-full font-serif text-2xl text-cal-200 md:text-3xl">
        <div className={`flex w-[80px]`}>
          #{data.id}
          <div className="ml-1.5 text-cal-700">
            <ChevronRight className="mt-1" />
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

function HeaderWithNav({ data, timer }) {
  return (
    <div className="grid grid-cols-2 lg:mb-20 lg:grid-cols-3">
      <div className="lg:col-start-2">
        <Header data={data} />
      </div>

      <div>
        <div className="flex place-content-end space-x-4">
          <div>
            {/* This empty parent div is required, it's keeping the roundedness of this circle */}
            <div className="flex items-center rounded-full border border-cal-800 p-2">
              <MoreVertical className="h-5 text-cal-400" />
            </div>
          </div>
          <div className="hidden space-x-2 lg:flex z-10">
            {timer}
            <ButtonNavigation id={data.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ data }) {
  return (
    <div className="mb-5 flex w-full font-serif text-xl font-bold text-cal-600 lg:place-content-center">
      72 Names of God
    </div>
  );
}

function Meditation({ data }) {
  return (
    <div className=" mt-12 mb-10 md:pl-[80px]">
      <h3 className="mb-5 font-serif text-2xl text-cal-300">Meditation</h3>

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
    <div className="min-h-[130px] flex w-full justify-center" {...handlers}>
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
