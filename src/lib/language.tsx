import { useRouter } from "next/router";
import English from "@/locales/en.json";
import Russian from "@/locales/ru.json";

export const Language = () => {
  let { locale } = useRouter();
  const lang = locale === "ru" ? Russian : English;

  return { locale, lang };
};