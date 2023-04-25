import { useSession } from "next-auth/react";

import Link from "next/link";
import { ReactNode, useEffect } from "react";
import Meta from "./meta";
import { useSignInModal } from "./sign-in-modal";
import { NavLinks } from "./NavLinks";
import clsx from "clsx";
import { MobilePopover, UserFlow } from "./Header/helper";
import { Logo } from "../Logo";
import { AppHeader } from "@/components/AppHeader";
import { LanguageButtons } from "@/lib/language"

import { useAtom } from "jotai";
import {
  signedInAtom,
  sigInModalToggleAtom,
  adminAtom,
  unauthenticatedAtom,
} from "@/atoms/index";
import { FormattedMessage, useIntl } from "react-intl";

import { useCommands } from "@/components/Command";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/router";
import { usePostHog } from "posthog-js/react";

export default function Layout({
  meta,
  children,
}: {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}) {
  const { SignInModal } = useSignInModal();
  const [sigInModalToggle, setSigInModalToggle] = useAtom(sigInModalToggleAtom);
  const [signedIn, setSignedInAtom] = useAtom(signedInAtom);
  const [, setAdminAtom] = useAtom(adminAtom);
  const [, setUnauthenticatedAtom] = useAtom(unauthenticatedAtom);

  const scrolled = false

  const { data: session, status: sessionStatus } = useSession();
  setSignedInAtom(sessionStatus === "authenticated");
  setUnauthenticatedAtom(sessionStatus === "unauthenticated");
  setAdminAtom(session?.user?.isAdmin == true);
  /* POSTHOG */
  const router = useRouter();
  const posthog = usePostHog();

  // useEffect(() => {
  //   const routerSignedIn = router.query.signedIn == "True";
  //   if (signedIn && routerSignedIn && posthog) {
  //     posthog.identify(session?.user?.email || "");
  //     router.replace(router.asPath, undefined, { shallow: true });
  //   }
  // }, [posthog, router, session?.user?.email, signedIn]);
  /* POSTHOG */

  // const userFlow = <UserFlow onClick={() => setSigInModalToggle(true)} />;
  const userFlow = null;

  const navLinks = [];
  navLinks.push({
    href: "/scan",
    label: <FormattedMessage id="scan" defaultMessage="Scan" />,
    member: false,
  });
  navLinks.push({
    href: "/names",
    label: <FormattedMessage id="allNames" defaultMessage="All Names" />,
    member: false,
  });
  navLinks.push({ href: "/admin", label: "Admin", member: true, admin: true });

  return (
    <>
      <Meta {...meta} />
      {sigInModalToggle && <SignInModal />}
      {/* TODO: remove this if it's not going to be used */}
      <div className={`z-30 hidden w-full`}>
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <div className="relative z-10 flex items-center gap-16">
            <Link href="/" className="font-display flex items-center text-2xl">
              <Logo className="mt-0 !text-cal-300 lg:mt-5" />
            </Link>
            <div className="hidden pt-4 lg:flex lg:gap-10">
              <NavLinks navLinks={navLinks} />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <MobilePopover navLinks={navLinks} userFlow={userFlow} />
            <div className="hidden lg:block">{userFlow}</div>
          </div>
        </div>
      </div>
      <main className="flex w-full flex-col items-center justify-center pt-10 lg:pt-16">
        <Commands />
        <AppHeader />
        {children}
        <Footer />
      </main>
    </>
  );
}

function Commands() {
  const { open: commandsOpen, setOpen: setCommandsOpen, commandsDialog } = useCommands()
  const router = useRouter()

  return (
    <div className="fixed bottom-9 right-4 z-[999] md:bottom-10 md:right-10">
      {commandsDialog()}
      <Button
        onClick={() => setCommandsOpen(true)}
        className={clsx(
          "h-[55px] rounded-full border-cal-600 bg-cal-900 font-serif text-xl font-bold text-cal-600 shadow transition-all duration-200 ease-in-out hover:border-cal-500 hover:bg-cal-800/50 hover:text-cal-100",
          router.route == "/[id]" ? "hidden lg:flex" : ""
        )}
      >
        72
      </Button>
    </div>
  );
}

const navigation = {
  main: [
    // {
    //   name: "Privacy Policy",
    //   href: process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL,
    //   target: "_blank",
    // },
    // {
    //   name: "Terms of Service",
    //   href: process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_URL,
    //   target: "_blank",
    // },
  ],
  // social: [
  //   {
  //     name: "Instagram",
  //     href: "#",
  //     icon: (props) => (
  //       <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
  //         <path
  //           fillRule="evenodd"
  //           d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
  //           clipRule="evenodd"
  //         />
  //       </svg>
  //     ),
  //   },
  //   {
  //     name: "YouTube",
  //     href: "#",
  //     icon: (props) => (
  //       <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
  //         <path
  //           fillRule="evenodd"
  //           d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
  //           clipRule="evenodd"
  //         />
  //       </svg>
  //     ),
  //   },
  // ],
};

function Footer() {
  return (
    <footer className="font-serif">
      <div className="py-10 px-6 sm:py-12 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link
                {...item}
                className="flex place-content-center text-sm leading-6 text-gray-600 hover:text-gray-900"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        {/* <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div> */}

        <div className="mt-10 font-sans font-light flex place-content-center">
          <LanguageButtons />
        </div>
        <p className="mt-5 mb-20 lg:mb-10  text-center text-xs leading-5 text-gray-500">
          &copy; 2023 Unitech Creative Technology Solutions PT. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
