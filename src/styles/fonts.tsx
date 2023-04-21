import { Montserrat, Cinzel } from "@next/font/google";

export const fontSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontSerif = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
});
