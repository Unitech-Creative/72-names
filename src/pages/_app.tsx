import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Provider as JotaiProvider } from "jotai";
import { IntlProvider } from "react-intl";
import Russian from "@/locales/ru.json";
import { Analytics } from "@vercel/analytics/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { fontSans, fontSerif } from "@/styles/fonts";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import "@tremor/react/dist/esm/tremor.css";
import "react-loading-skeleton/dist/skeleton.css";

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    // Disable in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.opt_out_capturing();
    },
  });
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  /* Facebook Pixel */
  if (
    process.env.NODE_ENV === "production" &&
    !!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
  ) {
    useEffect(() => {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.init(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
          ReactPixel.pageView();

          router.events.on("routeChangeComplete", () => {
            ReactPixel.pageView();
          });
        });
    }, [router.events]);
  }

  /* posthog */
  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog.capture("$pageview");
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
  /* posthog */

  let { locale } = useRouter();

  const messages = useMemo(() => {
    return locale === "ru" ? Russian : {};
  }, [locale]);

  return (
    <JotaiProvider>
      <PostHogProvider client={posthog}>
        <SessionProvider session={session}>
          <IntlProvider locale={locale} messages={messages}>
            <main
              className={`${fontSans.variable} ${fontSerif.variable} font-sans`}
            >
              <Component {...pageProps} />
            </main>
            <Analytics />
            <ReactQueryDevtools initialIsOpen={false} />
          </IntlProvider>
        </SessionProvider>
      </PostHogProvider>
    </JotaiProvider>
  );
};

export default trpc.withTRPC(MyApp);
