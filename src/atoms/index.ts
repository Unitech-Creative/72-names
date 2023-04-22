import { atom } from "jotai";

export function atomWithToggle(initialValue: boolean) {
  const anAtom = atom(initialValue, (get, set, nextValue) => {
    const update = nextValue !== undefined ? nextValue : !get(anAtom);
    set(anAtom, update);
  });

  return anAtom;
}

export const adminAtom = atomWithToggle(false);
export const sigInModalToggleAtom = atomWithToggle(false);
export const signedInAtom = atomWithToggle(false);
export const unauthenticatedAtom = atomWithToggle(false);
export const meditationSecondsAtom = atom(3 * 60);
export const restSecondsAtom = atom(2.5 * 60);
export const hasPermissionAtom = atomWithToggle(false);
export const permissionsLoadedAtom = atomWithToggle(false);
