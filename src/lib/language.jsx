import { useRouter } from "next/router";
import Pronounced from "@/locales/pronounced.json";
import EnglishNames from "@/locales/en.json";
import RussianNames from "@/locales/ru.json";
import EnglishApp from "@/locales/en.app.json";
import RussianApp from "@/locales/ru.app.json";
import Link from "next/link";
import { Badge } from "@/components/Badge";

const languages = {
  ru: "Русский",
  en: "English",
  // de: "Deutsch",
  // hr: "Hrvatski",
};

export const Language = () => {
  let { locale } = useRouter();
  const names = locale === "ru" ? RussianNames : EnglishNames;
  const app = locale === "ru" ? RussianApp : EnglishApp;

  const lang = Object.assign({}, names, app);


  return { locale, lang, Pronounced };
};


export const LanguageButtons = () => {
  const { locale, asPath } = useRouter();

  return (
    <div className="flex flex-row space-x-4 justify-center">
      {Object.entries(languages).map(([localeKey, languageName]) => {
        return (
          <LanguageButton
            key={localeKey}
            locale={localeKey}
            languageName={languageName}
            active={locale === localeKey}
            asPath={asPath}
          />
        );
      })}
    </div>
  );
};

const LanguageButton = ({ locale, languageName, active, asPath }) => {
  return (
    <Link href={asPath} locale={locale}>
      <Badge
        color={active ? "cal" : "gray"}
        className="py-2 px-4"
      >
        {languageName}
      </Badge>
    </Link>
  );
};
