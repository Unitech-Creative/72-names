import { trpc } from "@/utils/trpc";
import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  signedInAtom,
  hasPermissionAtom,
  permissionsLoadedAtom,
} from "@/atoms/index";

export default function useCoursePermissions(courseId) {
  // Permissions
  const { data: _hasPermission, isLoading: isLoadingPermissions } =
    trpc.user.hasCourseAccess.useQuery({ courseId: courseId });
  const [hasPermission, setHasPermission] = useAtom(hasPermissionAtom);
  const [permissionsLoaded, setPermissionsLoaded] = useAtom(
    permissionsLoadedAtom
  );
  const [signedIn] = useAtom(signedInAtom);

  useEffect(() => {
    if (isLoadingPermissions) {
      setHasPermission(false);
      return;
    }
    setPermissionsLoaded(true);
    setHasPermission(signedIn && _hasPermission);
    return;
  }, [
    isLoadingPermissions,
    _hasPermission,
    hasPermission,
    signedIn,
    setHasPermission,
    setPermissionsLoaded,
  ]);

  return { hasPermission, permissionsLoaded };
}
