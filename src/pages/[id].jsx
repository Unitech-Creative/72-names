import { ReactSVG } from "react-svg";
import Layout from "../components/layout";
import clsx from "clsx";
import Link from "next/link";
import { Check } from "lucide-react";
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

  return (
    <Layout>
      <Container>
        <div className="mt-10 rounded-lg border border-cal-700 p-10">
          <Header data={data} />
          <div className="grid-cols-2 lg:grid">
            <div>
              <NameHeader data={data} />
              <Meditation data={data} />
            </div>
            <ImageCard data={data} />
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
      <div className="mb-5 flex w-full">
        <div
          className={`flex w-[${INDENTATION}] text-2xl font-bold text-cal-200`}
        >
          #{data.id}{" "}
          <div className="ml-1.5 text-2xl text-cal-700">
            <ChevronRight className="mt-1" />
          </div>
        </div>
        <div className="text-2xl text-cal-300">{data.title}</div>
      </div>

      <div className={`my-5 ml-[${INDENTATION}] text-lg text-cal-400`}>
        {data.subTitle} <br />( {data.subSubTitle} )
      </div>
    </>
  );
}

function Header({ data }) {
  return (
    <div className="mb-5 flex w-full w-full place-content-end text-xl font-bold text-cal-600">
      72 Names of God
    </div>
  );
}

function Meditation({ data }) {
  return (
    <div className="my-10">
      <h3 className="mb-5 text-cal-300">Meditation</h3>

      <div className={`my-5 leading-6 text-cal-400 ml-[${INDENTATION}]`}>
        {data.meditation}
      </div>
    </div>
  );
}

function ImageCard({ data }) {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
      <div className="bordexr aspect-video rounded-lg border-cal-700">
        <Svg
          id={data.id}
          className="-mt-[50px] aspect-video w-[400px] border-cal-800  p-4 lg:-mt-[100px] lg:w-[600px]"
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
