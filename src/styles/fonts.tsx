import { Montserrat, Cinzel } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontSerif = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const fontStam = localFont({
  src: [
    {
      path: "../../public/fonts/Stam Ashkenaz CLM Medium.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-stam",
  display: "swap",
});
