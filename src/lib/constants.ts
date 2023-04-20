export const FADE_IN_ANIMATION_SETTINGS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 },
};

export const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
export const APP_LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL;
export const APP_FAVICON = process.env.NEXT_PUBLIC_FAVICON;

export const APP_META_TITLE = process.env.NEXT_PUBLIC_APP_META_TITLE;
export const APP_META_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_META_DESCRIPTION;
