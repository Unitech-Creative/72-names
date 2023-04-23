import Layout from "@/components/layout";
import { Container } from "@/components/layout/Container";
import { Language } from "@/lib/language";
import { ReactSVG } from "react-svg";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function NamesPage() {
  let { locale, lang, Pronounced } = Language();

  const names = Object.entries(lang).map(([key, value]) => ({
    id: key,
    ...value
  }));

  return (

    <Layout>
      <Container>
        <Logo className="mb-10 flex w-full place-content-center" />

        <div className="divide-y divide-cal-800 overflow-hidden rounded-lg shadow md:grid md:grid-cols-2 ">
          {names.map((name) => (
            <div
              key={name.id}
              className="group relative p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-600"
            >
              <div className="text-cal-500">
                #{name.id}
              </div>
              <div className="mt-8">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  <Link href={`/${name.id}`} className="focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {name.purpose}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {name.short}
                </p>
              </div>
              <div
                className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400 w-[100px]"
                aria-hidden="true"
              >
              <ReactSVG
                src={`/images/svgs/72-${name.id}.svg`}
                className="absolute top-0 left-0 -mt-[20px] w-full fill-cal-200"
              />


              </div>
            </div>
          ))}
        </div>

      </Container>
    </Layout>
  )
}
