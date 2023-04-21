import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/router";


export const goToNextId = (id, router) => {
  router.push(`/${getNextId(id)}`);
};

export const goToPreviousId = (id, router) => {
  router.push(`/${getPreviousId(id)}`);
};

export const getPreviousId = (id) => {
  const prevId = id - 1;
  const targetId = prevId < 1 ? 72 : prevId;
  return targetId;
};

export const PrevButton = ({ id }) => {
  return (
    <Link href={`/${getPreviousId(id)}`}>
      <ChevronLeft className="text-cal-400" />
    </Link>
  );
};

export const getNextId = (id) => {
  const nextId = id + 1;
  const targetId = nextId > 72 ? 1 : nextId;
  return targetId;
};

export const NextButton = ({ id }) => {
  return (
    <Link href={`/${getNextId(id)}`}>
      <ChevronRight className="text-cal-400" />
    </Link>
  );
};

export const ButtonNavigation = ({ id }) => {
  return (
    <div className="h-9 rounded-full border border-cal-800 py-1 px-2">
      <div className="grid grid-cols-2 divide-x divide-cal-600">
        <div className="mx-1 pt-0.5 z-10">
          <PrevButton id={id} />
        </div>
        <div className="ml-1 pl-1 pt-0.5 z-10">
          <NextButton id={id} />
        </div>
      </div>
    </div>
  );
};
