import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "@tremor/react";

// Defines the endpoint based on the current window location
const API_BASE =
  process.env.API_ENDPOINT ||
  (typeof window !== "undefined" && window.location.origin + "/api");
const INVITE_ENDPOINT = API_BASE + "/invite";

// Helper function that invokes the invite API endpoint
async function fetchInvite(code) {
  const requestUrl = new URL(INVITE_ENDPOINT);
  requestUrl.searchParams.append("code", code);
  const response = await fetch(requestUrl);
  const invite = await response.json();
  return invite;
}

// The custom hook
export default function useInvite() {
  // This hook has the inviteResponse and a possible error as state.
  const [inviteResponse, setInviteResponse] = useState(null);
  const [error, setError] = useState(null);

  // We want to make the API call when the component using the hook
  // is mounted so we use the useEffect hook.

  const getCode = () => {
    const url = new URL(window.location.toString());
    const code = url.searchParams.get("code");

    if (code) {
      window.localStorage.setItem("inviteCode", code);
      return code;
    }

    return window.localStorage.getItem("inviteCode");
  };

  const { status } = useSession();

  useEffect(() => {
    // We read the code from the current window URL.
    const code = getCode();

    if (status !== "authenticated") return;

    if (!code) {
      // If there is no code, we set an error message.
      setError("No code provided");
    } else {
      // If we have a code, we get the associated data.
      // In case of success or failure we update the state accordingly.
      fetchInvite(code)
        .then((response) => {
          if (response.error) {
            setError(response.error);
          } else {
            // window.localStorage.removeItem("inviteCode");
            setInviteResponse(response.invite);
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [status]);

  let badge = null;

  if (status !== "authenticated") {
    badge = <Badge text="Please Sign In" color="yellow" />;
  } else if (!inviteResponse && !error) {
    badge = <Badge text="Loading..." color="gray" />;
  } else if (inviteResponse) {
    badge = <Badge text={inviteResponse.status} color="green" />;
  } else if (error) {
    badge = <Badge text={error} color="red" />;
  }

  // We return the state variables function.
  return { inviteResponse, error, badge };
}
