import { Logo } from "../components/Logo";
import Link from "next/link";
import { useAtom } from "jotai";
import { commandsOpenAtom } from "@/atoms/index";
import { Eye, List } from "lucide-react";
import { useRouter } from "next/router";
import clsx from "clsx";

export function AppHeader(){
  const router = useRouter();
  const { route } = router;

  return (
    <div className="">
      <div className="flex w-full place-content-center lg:mt-0">
        <Logo className="!text-center !text-2xl !text-cal-300 block" />
      </div>
      <div className="flex items-center">
        <SearchButton route={route} />
        <Divider />
        <ScanButton route={route} />
        <Divider />
        <AllNamesButton route={route} />
      </div>
    </div>
  )
}

const buttonStyles = "my-10 flex space-x-4 rounded-full bg-cal-800/50 px-4 py-2 text-sm text-cal-200 hover:bg-cal-800/70 hover:text-cal-100";
const activeButtonStyle = "border border-cal-600"

function Divider() {
  return <div className="px-3 text-cal-800">|</div>;
}

function SearchButton({route}) {
  const [, setOpen] = useAtom(commandsOpenAtom);

  return (
    <button
      onClick={() => setOpen(true)}
      className={clsx(buttonStyles)}
    >
      <span className="mt-0.5font-serif text-sm font-bold text-cal-600">
        72
      </span>
      <p>Search</p>
    </button>
  );
}

function ScanButton({route}) {
  return (
    <Link
      href="/scan"
      className={clsx(buttonStyles, route == "/scan" ? activeButtonStyle : "" )}
    >
      <Eye size={16} className="mt-0.5 text-cal-600" />
      <p>Scan</p>
    </Link>
  );
}

function AllNamesButton({route}) {
  return (
    <Link
      href="/names"
      className={clsx(buttonStyles, route == "/names" ? activeButtonStyle : "" )}
    >
      <List size={16} className="mt-0.5 text-cal-600" />
      <p>Names</p>
    </Link>
  );
}
