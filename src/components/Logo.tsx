import Image from "next/image";
import Link from "next/link";
import { ReactSVG } from "react-svg";
import { APP_NAME, APP_LOGO_URL } from "@/lib/constants";

export function Logo() {
  // Thank you https://thenounproject.com/icon/light-2167925/
  return <ReactSVG src="/images/logo.svg" className="h-10 w-10 fill-black" />;
}
