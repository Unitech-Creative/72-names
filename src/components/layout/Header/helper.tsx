import { SignInButton } from "@/components/SignInButton";
import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";
import UserDropdown from "@/components/layout/user-dropdown";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Popover } from "@headlessui/react";
import { LogOut, Bookmark } from "lucide-react";
import Novu from "@/components/Novu";
import { useAtom } from "jotai";
import { adminAtom, lessonAtom, chapterAtom, courseAtom } from "@/atoms/index";
import { FormattedMessage } from "react-intl";
import clsx from "clsx";
import { useRouter } from "next/router";
import SanityLink from "@/components/SanityLink";

export function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MobileNavLink({ children, ...props }) {
  return (
    <Popover.Button
      as={Link}
      className="block text-base leading-7 tracking-tight text-gray-700"
      {...props}
    >
      {children}
    </Popover.Button>
  );
}

export function MobilePopover({ navLinks, userFlow }) {
  const { data: session, status } = useSession();
  const [admin] = useAtom(adminAtom);

  return (
    <div className="grid grid-cols-1 gap-3 lg:hidden">
      <Popover>
        {({ open }) => (
          <>
            <Popover.Button
              className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-cal-300 p-2 hover:bg-cal-600 hover:stroke-cal-200 active:stroke-cal-200 [&:not(:focus-visible)]:focus:outline-none"
              aria-label="Toggle site navigation"
            >
              {({ open }) =>
                open ? (
                  <ChevronUpIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )
              }
            </Popover.Button>
            <AnimatePresence initial={false}>
              {open && (
                <>
                  <Popover.Overlay
                    static
                    as={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-0 bg-cal-300/60 backdrop-blur"
                  />
                  <Popover.Panel
                    static
                    as={motion.div}
                    initial={{ opacity: 0, y: -32 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: -32,
                      transition: { duration: 0.2 },
                    }}
                    className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-cal-800 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
                  >
                    <div className="space-y-4">
                      {navLinks.map((navLink, index) => {
                        if (
                          navLink.admin &&
                          !!session?.user?.isAdmin === false
                        ) {
                          null;
                        } else {
                          return (
                            <NavLink key={index} index={index} {...navLink} />
                          );
                        }
                      })}
                      {userFlow}
                    </div>
                  </Popover.Panel>
                </>
              )}
            </AnimatePresence>
          </>
        )}
      </Popover>
    </div>
  );
}

function NavLink({ href, label, member }) {
  const { data: session, status } = useSession();
  if (member && !session) return;

  return (
    <MobileNavLink key={href} href={href} className="block text-cal-200">
      {label}
    </MobileNavLink>
  );
}

// function SanityDynamicLink() {
//   const [lesson] = useAtom(lessonAtom);
//   const [course] = useAtom(courseAtom);
//   const [admin] = useAtom(adminAtom);
//   const router = useRouter();
//   if (!admin) return;

//   const className = "pt-1";
//   if (router.pathname.startsWith("/lesson/")) {
//     return SanityLink(`/lesson;${lesson._id}`, "Edit Lesson", className);
//   } else if (router.pathname.startsWith("/course/")) {
//     return SanityLink(`/course;${course._id}`, "Edit Course", className);
//   }
// }

export function UserFlow({ onClick }) {
  const [admin] = useAtom(adminAtom);

  const { data: session, status } = useSession();
  return (
    <AnimatePresence>
      {!session && status !== "loading" ? (
        <SignInButton />
      ) : (
        <>
          <div className="hidden lg:block">
            <div
              className={clsx(
                "grid space-x-1.5",
                admin ? "grid-cols-4" : "grid-cols-3"
              )}
            >
              {/* <SanityDynamicLink /> */}
              <Link href="/liked" className="pt-1">
                <Bookmark className="h-6 w-6" />
              </Link>
              <div className="pt-1">
                <Novu />
              </div>
              <UserDropdown />
            </div>
          </div>
          {/* <div className="lg:hidden">
            <LogoutButton />
          </div> */}
        </>
      )}
    </AnimatePresence>
  );
}

export function LogoutButton() {
  return (
    <button
      className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
      onClick={() => signOut({ redirect: false })}
    >
      <LogOut className="h-4 w-4" />
      <p className="text-sm">
        {<FormattedMessage id="logout" defaultMessage="Logout" />}
      </p>
    </button>
  );
}
