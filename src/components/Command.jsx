import React, {useEffect} from "react"
import {
  ChevronLeftIcon,
  Search,
} from "lucide-react"


import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Language } from "@/lib/language";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { commandsOpenAtom } from "@/atoms/index";


import { useState } from "react";

const groups = [
  {
    title: "Love",
    items: [12, 17, 28, 30, 35, 44, 53, 58, 68]
  },
  {
    title: "Healing",
    items: [5, 41, 61]
  },
  {
    title: "Money",
    items: [27,38,41,45,46,63,70]
  },
  {
    title: "Sharing",
    items: [23, 38, 65]
  },
  {
    title: "Ego",
    items: [4,11,17,20,30,34,40,43,45,49]
  },
  {
    title: "Repentence",
    items: [51]
  }
]

export function useCommands() {
  const [open, setOpen] = useAtom(commandsOpenAtom)
  const [search, setSearch] = useState('')
  const [pages, setPages] = useState([])
  const page = pages[pages.length - 1]

  return {
    open, setOpen,
    commandsDialog: function() {
      return <Commands search={search} setSearch={setSearch} pages={pages} setPages={setPages} page={page} />
    }
  }

}

function Commands({ search, setSearch, pages, setPages, page}) {
  const [open, setOpen] = useAtom(commandsOpenAtom)

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open)
        setSearch("")
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog
      open={open} onOpenChange={setOpen}
      onKeyDown={(e) => {
        // Escape goes to previous page
        // Backspace goes to previous page when search is empty
        if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
          e.preventDefault()
          setPages((pages) => pages.slice(0, -1))
        }
      }}
    >
      <CommandInput
        placeholder="Type a name, number or search..."
        value={search} onValueChange={setSearch}
      />
      <CommandList className="max-h-[500px]">
        <CommandEmpty>
          No results found for "{search}"
        </CommandEmpty>

        <CommandGroup heading="Dialing God">
          <NameCommandItem id={19} />
        </CommandGroup>

        <Suggestions page={page} setPages={setPages} pages={pages} setSearch={setSearch} />
        <CommandSeparator />
        <Names page={page} />
      </CommandList>
    </CommandDialog>
  );
}

const Suggestions = ({page, setPages, pages, setSearch}) => {

  const selectSuggestion = (selectPage) => {
    setPages(selectPage)
    setSearch("")
  }

  return (
    <CommandGroup heading={page || "Suggestions"}>
      {page && (
        <CommandItem
          key={page}
          onSelect={() => setPages([])}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          <span>Back</span>
        </CommandItem>
      )}

      {groups.map((group, i) => (
        !page ? (
          <CommandItem
            key={i}
            onSelect={() => selectSuggestion([...pages, group.title])}
            className="group cursor-pointer"
          >
            <Search className="mr-2 h-3 w-3 text-cal-600 group-hover:text-cal-300" />
            <span>{group.title}</span>
          </CommandItem>
        ) : <React.Fragment key={i} />
      ))}
    </CommandGroup>
  );

};

const Names = ({page}) => {
  const [open, setOpen] = useAtom(commandsOpenAtom)
  const ids = Array.from({ length: 72 }, (_, i) => i + 1);
  const names = ids.map((id) => {

    const inGroups = groups.filter((group) => group.items.includes(id))
    const groupTitles = inGroups.map((group) => group.title)

    if( !page || groupTitles.includes(page)) {
      return <NameCommandItem key={id} id={id} />
    }else{
      return <React.Fragment key={id} />
    }
  });

  return <CommandGroup heading="All Names">{names}</CommandGroup>;
}

const NameCommandItem = ({ id }) => {
  const [open, setOpen] = useAtom(commandsOpenAtom)
  let { lang, Pronounced } = Language();
  const router = useRouter()
  const data = lang[id]
  const pronounced = Pronounced[String(id)];

  return (
    <CommandItem
      key={id}
      onSelect={() => {
        router.push(`/${id}`);
        setOpen(false);
      }}
      className="group cursor-pointer"
    >
      <div className="w-full">
        <div className="flex space-x-4">
          <div className="text-cal-500 group-hover:text-cal-200">#{id}</div>
          <div>
            <div className="flex text-cal-300 group-hover:text-cal-200">
              {data.purpose}
            </div>
            <div className="flex font-normal text-cal-500 group-hover:font-semibold">
              {data.short}
            </div>
          </div>
        </div>
        <div className="mt-4 flex place-content-end">
          <div className="w-fit rounded-full border border-cal-700 px-5 py-1 font-semibold">
            <div className="!text-xs leading-6 text-cal-400">{pronounced}</div>
          </div>
        </div>
      </div>
    </CommandItem>
  );

}
