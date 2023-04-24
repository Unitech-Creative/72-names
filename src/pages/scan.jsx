import { ReactSVG } from "react-svg";
import Layout from "../components/layout";
import clsx from "clsx";
import Link from "next/link";
import { ChevronLeft, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Logo } from "../components/Logo";

export default function Home({}) {
  return (
    <Layout>
      <Container className="w-full">
        <div className="">
          <Header />
          <ScanChart />
        </div>
      </Container>
    </Layout>
  );
}

function Header() {
  return (
    <div className="mb-10 flex place-content-end p-2 px-3 font-serif text-sm text-cal-700">
      <ArrowLeft className="-mt-0.5 mr-2 w-4" /> scan right to left
    </div>
  );
}

function ScanChart() {
  const n = 72;

  const Divider = () =>
    // <div className="col-span-8 my-2 h-0.5 w-full bg-gradient-to-tl from-cal-100 to-cal-950 "></div>
    null;

  return (
    <div className="flex place-content-center">
      <div className="grid grid-cols-8 w-fit mb-10">
        {Array.from({ length: n }, (_, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const reversedIndex = row * 8 + (7 - col);

          return (
            <React.Fragment key={index}>
              <NameOfGod
                key={index}
                position={reversedIndex + 1}
                className="aspect-video w-[50px] border-cal-800 p-4 md:w-[90px] lg:w-[110px]"
              />

              {(index + 1) % 8 === 0 && index !== n - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function NameOfGod({ position, className }) {
  const debug = false;

  return (
    <Link
      href={String(position)}
      className={clsx(className, "relative", "fill-white hover:fill-red-500", {
        "bg-sky-300": debug,
      })}
    >
      {debug && (
        <div className="absolute bottom-0 right-0 h-1/2 w-full bg-green-800"></div>
      )}

      <ReactSVG
        src={`/images/svgs/72-${position}.svg`}
        className="absolute top-0 left-0 -mt-[20px] w-full"
      />
      {debug && (
        <div className="text-red absolute bottom-0 right-0 text-sm">
          {position}
        </div>
      )}
    </Link>
  );
}
