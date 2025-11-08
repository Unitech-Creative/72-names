import { useMemo } from "react";
import clsx from "clsx";
import * as Icons from "lucide-react";

import { fontStam } from "@/styles/fonts";

export const FINAL_FORM_LETTERS = {
  MEM: { default: "מ", final: "ם" },
  KAF: { default: "כ", final: "ך" },
  NUN: { default: "נ", final: "ן" },
  PEY: { default: "פ", final: "ף" },
  ZADIK: { default: "צ", final: "ץ" },
};

export const TRANSLITERATION_MAP = {
  ALEPH: "א",
  AYIN: "ע",
  AYEN: "ע",
  BET: "ב",
  CHET: "ח",
  DALED: "ד",
  DALET: "ד",
  HEY: "ה",
  KAF: FINAL_FORM_LETTERS.KAF.default,
  KUF: "ק",
  LAMED: "ל",
  MEM: FINAL_FORM_LETTERS.MEM.default,
  NUN: FINAL_FORM_LETTERS.NUN.default,
  PEY: FINAL_FORM_LETTERS.PEY.default,
  RESH: "ר",
  SAMECH: "ס",
  SHIN: "ש",
  TAV: "ת",
  TET: "ט",
  VAV: "ו",
  YUD: "י",
  ZADIK: FINAL_FORM_LETTERS.ZADIK.default,
  ZAYIN: "ז",
};

export const DEFAULT_HEBREW_SPACING = {
  LAMED: { default: ["pt-20"], last: ["pl-10"] },
  KUF: { default: ["pb-14"] },
  PEY: { default: ["pb-4"] },
  KAF: { final: ["pb-20"] },
  MEM: { final: ["pt-20"] },
  NUN: { final: ["pt-20"] },
  ZADIK: { final: ["pt-20"] },
};

const FINAL_FORM_OVERRIDES = {
  "YUD BET MEM": {
    MEM: "default",
  },
  "MEM YUD KAF": {
    "KAF": "default"
  }
};

const toArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export function transliterationToHebrew(
  pronounced,
  map = TRANSLITERATION_MAP,
  finalForms = FINAL_FORM_LETTERS,
  options = {}
) {
  if (!pronounced) {
    return { tokens: [], glyphs: [], text: "" };
  }

  const tokens = pronounced
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.toUpperCase());

  const glyphs = tokens
    .map((token) => map[token] ?? "")
    .slice()
    .reverse()
    .map((char, index) => {
      const token = tokens[tokens.length - 1 - index];
      const finalState = finalForms[token];
      const override =
        options?.finalFormOverrides?.[token] ?? options?.finalFormOverrides?.[index];

      if (override === "default") {
        return finalState?.default ?? char;
      }
      if (override === "final") {
        return finalState?.final ?? char;
      }
      if (typeof override === "string") {
        return override;
      }

      if (finalState) {
        return index === 0 ? finalState.final : finalState.default;
      }
      return char;
    });

  return {
    tokens,
    glyphs,
    text: glyphs.join(""),
  };
}

function collectSpacingClasses(tokens, spacingConfig, finalForms) {
  const uniqueClasses = new Set();
  const total = tokens.length;

  tokens.forEach((token, index) => {
    const config = spacingConfig?.[token];
    if (!config) {
      return;
    }

    const isFinalToken = !!finalForms[token] && index === total - 1;

    const baseClasses = (() => {
      if (typeof config === "string" || Array.isArray(config)) {
        return toArray(config);
      }

      const defaults = toArray(config.default);
      const finals = toArray(config.final);

      if (isFinalToken && finals.length > 0) {
        return finals;
      }

      return defaults;
    })();

    baseClasses.forEach((cls) => {
      if (cls) {
        uniqueClasses.add(cls);
      }
    });

    if (typeof config === "object" && !Array.isArray(config)) {
      if (index === 0) {
        toArray(config.first).forEach((cls) => {
          if (cls) uniqueClasses.add(cls);
        });
      }
      if (index === total - 1) {
        toArray(config.last).forEach((cls) => {
          if (cls) uniqueClasses.add(cls);
        });
      }
    }
  });

  return Array.from(uniqueClasses);
}

export default function HebrewName({
  pronounced,
  containerClassName,
  charClassName,
  dotClassName,
  dotStrokeWidth = 2,
  spacingConfig = DEFAULT_HEBREW_SPACING,
  transliterationMap = TRANSLITERATION_MAP,
  finalForms = FINAL_FORM_LETTERS,
  pairClassName,
  pairGapClassName,
}) {
  const finalFormOverrides = useMemo(() => {
    if (!pronounced) return undefined;
    const normalized = pronounced.trim().replace(/\s+/g, " ").toUpperCase();
    return FINAL_FORM_OVERRIDES[normalized];
  }, [pronounced]);

  const { tokens, glyphs } = useMemo(
    () =>
      transliterationToHebrew(
        pronounced,
        transliterationMap,
        finalForms,
        finalFormOverrides ? { finalFormOverrides } : undefined
      ),
    [pronounced, transliterationMap, finalForms, finalFormOverrides]
  );

  const spacingClasses = useMemo(
    () => collectSpacingClasses(tokens, spacingConfig, finalForms),
    [tokens, spacingConfig, finalForms]
  );

  if (!glyphs.length) {
    return null;
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        containerClassName,
        spacingClasses
      )}
    >
      {glyphs.map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={clsx(
            "flex items-center",
            pairClassName,
            pairGapClassName
          )}
        >
          {index > 0 && (
            <Icons.Dot
              className={clsx("text-cal-50", dotClassName)}
              strokeWidth={dotStrokeWidth}
            />
          )}
          <span
            className={clsx(fontStam.className, "font-stam text-cal-50", charClassName)}
          >
            {char}
          </span>
        </span>
      ))}
    </div>
  );
}

