import Layout from "@/components/layout";
import { Container } from "@/components/layout/Container";
import { Language } from "@/lib/language";
import Link from "next/link";
import clsx from "clsx";
import * as Icons from "lucide-react";
import Head from "next/head";

import HebrewName from "@/components/HebrewName";

export default function NamesPage() {
  let { locale, lang, Pronounced } = Language();

  // Debug: filter for names whose pronounced contains "mem" (case-insensitive)
  const names = Object.entries(lang)
    .filter(([key]) => parseInt(key) >= 1 && parseInt(key) <= 72)
    .map(([key, value]) => ({
      id: key,
      pronounced: Pronounced[key],
      ...value
    }))
    

  return (

    <Layout>
      <Head>
        <title>72 Names of God</title>
      </Head>
      <Container>
        <div className="overflow-hidden rounded-lg md:grid md:grid-cols-2 ">
          {names.map((name) => (
            <div
              key={name.id}
              className={clsx("border-cal-800 group relative p-6",
                {'border-b': ![71,72].includes(Number(name.id)) },
                {'border-b md:border-0': name.id == 71 },
              )}
            >
              <div className="text-cal-500 group-hover:text-cal-200 flex">
                #{name.id} <Icons.Dot /> <span className="text-xs pt-1">{name.pronounced}</span>
              </div>
              <div className="mt-8">
                <h3 className="text-base font-semibold leading-6">
                  <Link href={`/${name.id}`} className="focus:outline-none text-cal-300 group-hover:text-cal-200">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {name.purpose}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-cal-500">
                  {name.short}
                </p>
              </div>
              <div
                className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400 w-[100px]"
                aria-hidden="true"
              >
                
                <div className="absolute top-0 left-0 w-full fill-cal-400 group-hover:fill-cal-200">
                  <HebrewName
                    pronounced={name.pronounced}
                    containerClassName="mt-4 justify-start text-cal-400"
                    charClassName="!text-cal-300 text-4xl leading-none tracking-tight transition-colors group-hover:!text-cal-100"
                    dotClassName="!text-cal-500 h-5 w-5 transition-colors group-hover:!text-cal-200"
                    dotStrokeWidth={1.5}
                    pairGapClassName="gap-0"
                    pairOffsetClassName="ml-0"
                    spacingConfig={{}}
                />
              </div>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </Layout>
  )
}
