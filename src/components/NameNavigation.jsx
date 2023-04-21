import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const PrevButton = ({ id }) => {
  const goToPreviousId = () => {
    const prevId = id - 1;
    const targetId = prevId < 1 ? 72 : prevId;
    return targetId;
  };

  return (
    <Link href={`/${goToPreviousId()}`}>
      <ChevronLeft className="text-cal-400" />
    </Link>
  );
};

export const NextButton = ({ id }) => {
  const goToNextId = () => {
    const nextId = id + 1;
    const targetId = nextId > 72 ? 1 : nextId;
    return targetId;
  };

  return (
    <Link href={`/${goToNextId()}`}>
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
