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
export const timerActiveAtom = atomWithToggle(false);
export const timerSecondsAtom = atom(0);
export const storageUpdatedAtom = atomWithToggle(false);
export const isRestingAtom = atomWithToggle(false);
export const meditationSecondsAtom = atom(3 * 60);
export const restSecondsAtom = atom(2.5 * 60);
export const fullScreenAtom = atom(false);
export const hasPermissionAtom = atomWithToggle(false);
export const permissionsLoadedAtom = atomWithToggle(false);
export const commandsOpenAtom = atomWithToggle(false);
export const iOSAtom = atomWithToggle(false);
export const iOSFullScreenAtom = atomWithToggle(false);
export const developerAtom = atomWithToggle(false);
