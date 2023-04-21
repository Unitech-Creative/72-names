import { ReactSVG } from "react-svg";
import Layout from "../components/layout";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/Container";

const INDENTATION = "80px";

export default function Home({ id }) {
  const data = {
    id: id,
    title: "Fertility",
    subTitle: "build your vessel and spiritual DNA of fertility",
    subSubTitle: "When conception is difficult",
    meditation: `I have the power of clear vision and foresight in every part of my
    life. The blindfolds are removed. I can see the full–grown tree within
    the newly planted seed. I can grasp the cause-and-effect relationship
    that governs all of reality. My life choices and actions are motivated
    by ultimate results, not momentary illusions. I can now also see more
    with my eyes. I can perceive more through my mind’s eye. And I feel
    more through my intuition.`,
  };

  const imageCard = <ImageCard data={data} />;

  return (
    <Layout>
      <Container>
        <div className="rounded-lg border border-cal-700 p-3 md:p-4 lg:mt-10 lg:p-10">
          <Header data={data} />
          <div className="grid-cols-2 space-x-1 lg:grid">
            <div>
              <NameHeader data={data} />
              <div className="lg:hidden">{imageCard}</div>
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
      <div className="mb-5 flex w-full font-serif text-3xl text-cal-200">
        <div className={`flex w-[${INDENTATION}]`}>
          #{data.id}{" "}
          <div className="ml-1.5 text-cal-700">
            <ChevronRight className="mt-1" />
          </div>
        </div>
        <div className="">{data.title}</div>
      </div>

      <div className={`my-5 ml-[${INDENTATION}] leading-6 text-cal-400`}>
        {data.subTitle} <br />( {data.subSubTitle} )
      </div>
    </>
  );
}

function Header({ data }) {
  return (
    <div className="mb-5 flex w-full font-serif text-xl font-bold text-cal-600 lg:place-content-end">
      72 Names of God
    </div>
  );
}

function Meditation({ data }) {
  return (
    <div className="my-10">
      <h3 className="mb-5 font-serif text-2xl text-cal-300">Meditation</h3>

      <div className={`my-5 leading-6 text-cal-400 ml-[${INDENTATION}]`}>
        {data.meditation}
      </div>
    </div>
  );
}

function ImageCard({ data }) {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
      <div className="bordexr aspect-video overflow-hidden rounded-lg border-cal-700">
        <Svg
          id={data.id}
          className="-mt-[20px] aspect-video w-[260px] border-cal-800 p-4 md:-mt-[40px] md:w-[400px] lg:-mt-[100px] lg:w-[600px]"
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
