import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { useInView } from "framer-motion";

import { Language } from "@/lib/language";
import { ReactSVG } from "react-svg";

function getNames() {
  let { lang, Pronounced } = Language();


  const names = Object.entries(lang)
    .filter(([key, value]) => parseInt(key) >= 1 && parseInt(key) <= 72) // filter by keys between 1 and 72
    .map(([key, value]) => ({
      id: key,
      ...value,
      pronounced: Pronounced[key],
    }));


  return names;
}

function Name({ purpose, short, id, className, ...props }) {
  let animationDelay = useMemo(() => {
    let possibleAnimationDelays = [
      "0s",
      "0.1s",
      "0.2s",
      "0.3s",
      "0.4s",
      "0.5s",
    ];
    return possibleAnimationDelays[
      Math.floor(Math.random() * possibleAnimationDelays.length)
    ];
  }, []);

  return (
    <figure
      className={clsx(
        "group animate-fade-in rounded-3xl bg-cal-950 p-6 text-center opacity-0 shadow-md shadow-gray-800/5",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <blockquote className="">
        <p className="mt-4 text-lg font-semibold leading-6 text-cal-300">
          {purpose}
        </p>
        <div className="mt-3 flex place-content-center text-base leading-7">
          <div className="w-3/4">
            <ReactSVG
              src={`/images/svgs/72-${id}.svg`}
              className="-mt-[20px] mb-5 w-full fill-cal-400 group-hover:fill-cal-200"
            />
          </div>
        </div>
      </blockquote>
      <figcaption className="mt-3 text-sm text-gray-400">{short}</figcaption>
    </figure>
  );
}

function splitArray(array, numParts) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }
  return result;
}

function NameColumn({
  className,
  names,
  nameClassName = () => {},
  msPerPixel = 0,
}) {
  let columnRef = useRef();
  let [columnHeight, setColumnHeight] = useState(0);
  let duration = `${columnHeight * msPerPixel}ms`;

  useEffect(() => {
    let resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current.offsetHeight);
    });

    resizeObserver.observe(columnRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={columnRef}
      className={clsx("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration }}
    >
      {names.concat(names).map((name, nameIndex) => (
        <Name
          key={nameIndex}
          aria-hidden={nameIndex >= names.length}
          className={nameClassName(nameIndex % names.length)}
          {...name}
        />
      ))}
    </div>
  );
}

function NameGrid() {
  let containerRef = useRef();
  let isInView = useInView(containerRef, { once: true, amount: 0.4 });
  const names = getNames();
  let columns = splitArray(names, 3);
  columns = [columns[0], columns[1], splitArray(columns[2], 2)];

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 mt-5 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:mt-16 lg:grid-cols-3"
    >
      {isInView && (
        <>
          <NameColumn
            names={[...columns[0], ...columns[2].flat(), ...columns[1]]}
            nameClassName={(nameIndex) =>
              clsx(
                nameIndex >= columns[0].length + columns[2][0].length &&
                  "md:hidden",
                nameIndex >= columns[0].length && "lg:hidden"
              )
            }
            msPerPixel={10}
          />
          <NameColumn
            names={[...columns[1], ...columns[2][1]]}
            className="hidden md:block"
            nameClassName={(nameIndex) =>
              nameIndex >= columns[1].length && "lg:hidden"
            }
            msPerPixel={12}
          />
          <NameColumn
            names={columns[2].flat()}
            className="hidden lg:block"
            msPerPixel={10}
          />
        </>
      )}
      <div className="mx-2 pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cal-900" />
      <div className="mx-2 pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cal-900" />
    </div>
  );
}

export function ScrollingNames() {
  return (
    <>
      <div className="p-3 lg:p-0">
        <h2
          id="names-title"
          className="text-center font-serif text-3xl text-cal-300"
        >
          The Frequency of Miracles
        </h2>
        <p className="mt-2 text-center text-lg text-cal-300">
          Attune yourself with these universal forces to unleash their powers
          within you.
        </p>
      </div>
      <NameGrid />
    </>
  );
}
