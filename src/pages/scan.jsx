import { ReactSVG } from "react-svg";
import Layout from "../components/layout";
import clsx from "clsx";
import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import React from "react";

export default function Home({}) {
  return (
    <Layout>
      <div>
        <Header />

        <ScanChart />
      </div>
    </Layout>
  );
}

// export async function getStaticProps(context) {

//   return {
//     props: {  }, // will be passed to the page component as props
//   };
// }

function Tip() {
  const [showCheck, setShowCheck] = useState(false);

  const handleMouseEnter = () => {
    setShowCheck(true);
  };

  const handleMouseLeave = () => {
    setShowCheck(false);
  };
}

function Header() {
  return (
    <div className="mb-5">
      <h1 className="flex place-content-end space-x-3 text-right text-xl font-bold">
        <div className="text-cal-300">Scan</div>
        <div>&lt;</div>
        <div>72 Names of God</div>
      </h1>
      <div className="mt-10">
        <div className="mt-10 flex place-content-end ">
          <div className="flex p-2 px-3 text-sm text-cal-700">
            <ArrowLeft className="-mt-0.5 mr-2 w-4" /> scan right to left
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanChart() {
  const n = 72;

  const Divider = () => (
    <div className="col-span-8 my-2 h-0.5 w-full bg-gradient-to-tl from-cal-100 to-cal-950 "></div>
  );

  return (
    <div className="grid grid-cols-8">
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
      <Divider />
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
