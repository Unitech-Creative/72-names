import Layout from "@/components/layout";
import { Container } from "@/components/layout/Container";
import { Language } from "@/lib/language";
import { ReactSVG } from "react-svg";
import { Logo } from "@/components/Logo";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {

  let { locale, lang, Pronounced } = Language();

  const actions = Object.entries(lang).map(([key, value]) => ({
    id: key,
    ...value
  }));

  return (

    <Layout>
      <Container>

      <Logo className="mb-10 flex w-full lg:place-content-center" />

    <div className="divide-y divide-cal-800 overflow-hidden rounded-lg shadow md:grid md:grid-cols-2 ">
      {actions.map((action, actionIdx) => (
        <div
          key={action.id}
          className={classNames(
            actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
            actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
            actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
            actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
            'group relative p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
          )}
        >
          <div className="text-cal-500">
            #{action.id}
          </div>
          <div className="mt-8">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              <a href={`/${action.id}`} className="focus:outline-none">
                {/* Extend touch target to entire panel */}
                <span className="absolute inset-0" aria-hidden="true" />
                {action.purpose}
              </a>
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {action.short}
            </p>
          </div>
          <div
            className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400 w-[100px]"
            aria-hidden="true"
          >
          <ReactSVG
            src={`/images/svgs/72-${action.id}.svg`}
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
