import { useRouter } from "next/router";
import Pronounced from "@/locales/pronounced.json";
import English from "@/locales/en.json";
import Russian from "@/locales/ru.json";
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
  const lang = locale === "ru" ? Russian : English;

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
