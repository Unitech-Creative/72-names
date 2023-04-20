import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { registerComponent } from "@plasmicapp/host";

import { SignInButton } from "@/components/SignInButton";
import { IntimacyFaqs } from "@/components/plasmic/IntimacyFaqs";
import { TetatetFaqs } from "@/components/plasmic/TetatetFaqs";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID,
      token: process.env.NEXT_PUBLIC_PLASMIC_PROJECT_TOKEN,
    },
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: process.env.NODE_ENV !== "production",
});

registerComponent(SignInButton, {
  name: "SignInButton",
  props: {},
  importPath: "./src/components/SignInButton",
});

registerComponent(IntimacyFaqs, {
  name: "IntimacyFaqs",
  props: {},
  importPath: "./src/components/plasmic/IntimacyFaqs",
});

registerComponent(TetatetFaqs, {
  name: "TetatetFaqs",
  props: {},
  importPath: "./src/components/plasmic/TetatetFaqs",
});