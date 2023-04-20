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
export const lessonAtom = atom(null);
export const chapterAtom = atom(null);
export const courseAtom = atom(null);
export const commentsAtom = atom([]);
export const hasPermissionAtom = atomWithToggle(false);
export const permissionsLoadedAtom = atomWithToggle(false);