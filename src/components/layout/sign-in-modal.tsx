import Modal from "@/components/shared/modal";
import { signIn } from "next-auth/react";
import { useState, useCallback, useMemo } from "react";
import { LoadingDots, Google } from "@/components/shared/icons";
import { Logo } from "../Logo";
import { useAtom } from "jotai";
import { FormattedMessage, useIntl } from "react-intl";
import { sigInModalToggleAtom } from "@/atoms/index";
import { useRouter } from "next/router";

const SignInModal = () => {
  const [sigInModalToggle, setSigInModalToggle] = useAtom(sigInModalToggleAtom);
  const [signInClicked, setSignInClicked] = useState(false);
  const router = useRouter();

  function appendQueryParam(url: string, param: string) {
    const separator = url.includes("?") ? "&" : "?";
    return url + separator + param;
  }

  const handleSignInWithGoogle = () => {
    setSignInClicked(true);
    const callbackUrl = appendQueryParam(router.asPath, "signedIn=True");
    signIn("google", { callbackUrl });
  };

  return (
    <Modal
      showModal={sigInModalToggle}
      setShowModal={() => setSigInModalToggle(false)}
    >
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <Logo />
          <h3 className="font-display text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-gray-500">Let&apos;s get started</p>
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          <button
            disabled={signInClicked}
            className={`${
              signInClicked
                ? "cursor-not-allowed border-gray-200 bg-gray-100"
                : "border border-gray-200 bg-white text-black hover:bg-gray-50"
            } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
            onClick={handleSignInWithGoogle}
          >
            {signInClicked ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <Google className="h-5 w-5" />
                <p>
                  {
                    <FormattedMessage
                      id="signInWithGoogle"
                      defaultMessage="Sign in with Google"
                    />
                  }
                </p>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export function useSignInModal() {
  // const [, setShowSignInModal] = useAtom(setShowSignInModalAtom);
  const [sigInModalToggle, setSigInModalToggle] = useAtom(sigInModalToggleAtom);

  const SignInModalCallback = useCallback(() => {
    return <SignInModal />;
  }, []);

  return useMemo(
    () => ({ setSigInModalToggle, SignInModal: SignInModalCallback }),
    [setSigInModalToggle, SignInModalCallback]
  );
}
