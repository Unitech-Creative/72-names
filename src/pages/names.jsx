import Layout from "@/components/layout";
import { Container } from "@/components/layout/Container";
import { Language } from "@/lib/language";
import { ReactSVG } from "react-svg";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import clsx from "clsx";

export default function NamesPage() {
  let { locale, lang, Pronounced } = Language();

  const names = Object.entries(lang).map(([key, value]) => ({
    id: key,
    ...value
  }));

  return (

    <Layout>
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
              <div className="text-cal-500 group-hover:text-cal-200">
                #{name.id}
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
                <ReactSVG
                  src={`/images/svgs/72-${name.id}.svg`}
                  className="absolute top-0 left-0 -mt-[20px] w-full fill-cal-400 group-hover:fill-cal-200"
                />
              </div>
            </div>
          ))}
        </div>

      </Container>
    </Layout>
  )
}
