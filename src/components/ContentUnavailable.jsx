import { SignInButton } from "@/components/SignInButton";
import { useAtom } from "jotai";
import {
  signedInAtom,
  hasPermissionAtom,
  permissionsLoadedAtom,
  unauthenticatedAtom,
} from "@/atoms/index";

export default function ContentUnavailable({}) {
  const [signedIn] = useAtom(signedInAtom);
  const [unauthenticated] = useAtom(unauthenticatedAtom);
  const [hasPermission] = useAtom(hasPermissionAtom);
  const [permissionsLoaded] = useAtom(permissionsLoadedAtom);

  if (!permissionsLoaded) return null;

  if (unauthenticated)
    return (
      <div className="bordered-card my-10 flex w-full max-w-screen-xl justify-center">
        <SignInButton />
      </div>
    );

  if (signedIn && !hasPermission)
    return (
      <div className="bordered-card my-10 flex w-full max-w-screen-xl justify-center">
        <div className=" rounded-md border-gray-900 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 p-5 shadow-xl">
          <h2 className="text-center text-2xl font-bold text-white">
            Subscribe to access this course
          </h2>
        </div>
      </div>
    );
}
