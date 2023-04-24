import Layout from "../components/layout";
import { Container } from "@/components/layout/Container";
import { Logo } from "../components/Logo";
import { ScrollingNames } from "@/components/ScrollingNames";
import Link from "next/link";
import { useAtom } from "jotai";
import { commandsOpenAtom } from "@/atoms/index";
import { Eye, List } from "lucide-react";

export default function Home({}) {
  return (
    <Layout>
      <div className="-mt-10 flex items-center lg:mt-0">
        <Logo className="hidden !text-center !text-2xl !text-cal-300 lg:block" />
      </div>
      <div className="flex items-center">
        <SearchButton />
        <Divider />
        <ScanButton />
        <Divider />
        <AllNamesButton />
      </div>
      <Container>
        <ScrollingNames />
      </Container>
    </Layout>
  );
}

function Divider() {
  return <div className="px-3 text-cal-800">|</div>;
}

function SearchButton() {
  const [, setOpen] = useAtom(commandsOpenAtom);

  return (
    <button
      onClick={() => setOpen(true)}
      className="my-10 flex space-x-4 rounded-full bg-cal-800/50 px-4 py-2 text-sm text-cal-200 hover:bg-cal-800/70 hover:text-cal-100"
    >
      <span className="mt-0.5font-serif text-sm font-bold text-cal-600">
        72
      </span>
      <p>Search</p>
    </button>
  );
}

function ScanButton() {
  return (
    <Link
      href="/scan"
      className="my-10 flex space-x-4 rounded-full bg-cal-800/50 px-4 py-2 text-sm text-cal-200 hover:bg-cal-800/70 hover:text-cal-100"
    >
      <Eye size={16} className="mt-0.5 text-cal-600" />
      <p>Scan</p>
    </Link>
  );
}

function AllNamesButton() {
  return (
    <Link
      href="/names"
      className="my-10 flex space-x-4 rounded-full bg-cal-800/50 px-4 py-2 text-sm text-cal-200 hover:bg-cal-800/70 hover:text-cal-100"
    >
      <List size={16} className="mt-0.5 text-cal-600" />
      <p>Names</p>
    </Link>
  );
}
