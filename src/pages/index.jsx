import Layout from "../components/layout";
import { Container } from "@/components/layout/Container";
import { Logo } from "../components/Logo";
import { ScrollingNames } from "@/components/ScrollingNames";
import { Search } from "lucide-react";
import { useAtom } from "jotai";
import { commandsOpenAtom } from "@/atoms/index";

export default function Home({}) {

  return (
    <Layout>
      <div class="flex items-center -mt-10 lg:mt-0">
        <Logo className="!text-cal-300 !text-2xl !text-center hidden lg:block" />
      </div>
      <div class="flex place-content-center">
        <SearchButton />
      </div>
      <Container>
        <ScrollingNames />
      </Container>
    </Layout>
  );
}

function SearchButton() {
  const [, setOpen] = useAtom(commandsOpenAtom);

  return (
    <button
      onClick={() => setOpen(true)}
      class="my-10 flex space-x-4 rounded-full bg-cal-800/50 px-4 py-2 text-sm text-cal-200 hover:text-cal-100 hover:bg-cal-800/60"
    >
      {/* <Search size={16} className="mt-0.5" /> */}
      <span className="mt-0.5font-serif text-sm font-bold text-cal-600">72</span>
      <p>Search</p>
    </button>
  );
}
