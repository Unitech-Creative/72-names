import { withSentryConfig } from "@sentry/nextjs";

// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && import("./src/env/server.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "i.ytimg.com",
      "vumbnail.com",
    ],
  },
  i18n: {
    locales: ["en", "ru"],
    defaultLocale: "en",
    localeDetection: false,
    domains: [
      {
        domain: "www.example.com",
        defaultLocale: "ru",
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

/**
 *
 * @type {Partial<import('@sentry/nextjs').SentryWebpackPluginOptions>}
 */
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // deploy: {
  //   env: process.env.VERCEL_ENV,
  // },
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Wrap the bundle with Sentry only if built/deployed in Vercel,
// so Sentry is not enabled in local env.
const activeConfig = process.env.SENTRY_PROJECT
  ? withSentryConfig(config, sentryWebpackPluginOptions)
  : config;

export default activeConfig;
