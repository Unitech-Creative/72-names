import React, {useEffect} from "react"
import {
  ChevronLeftIcon,
  Calendar,
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


import { useState, useRef } from "react";

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
    items: [41,45, 70]
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

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [pages, setPages] = useState([])
  const page = pages[pages.length - 1]

  return {
    open, setOpen,
    commandsDialog: function() {
      return <Commands open={open} setOpen={setOpen} search={search} setSearch={setSearch} pages={pages} setPages={setPages} page={page} />
    }
  }

}

function Commands( {open, setOpen, search, setSearch, pages, setPages, page} ) {
  useEffect(() => {
    console.log("useEffect, commands")
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
        <CommandEmpty>No results found.</CommandEmpty>
        <Suggestions page={page} setPages={setPages} pages={pages} />
        <CommandSeparator />
        <Names page={page} />
      </CommandList>
    </CommandDialog>
  );
}

const Suggestions = ({page, setPages, pages}) => {

  return (
    <CommandGroup heading={page || "Suggestions"}>
      {page && (
        <CommandItem
          onSelect={() => setPages([])}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          <span>BACK</span>
        </CommandItem>
      )}

      {groups.map((group) => (
        !page ? (
          <CommandItem
            key={group.id}
            onSelect={() => setPages([...pages, group.title])}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>{group.title}</span>
          </CommandItem>
        ) : <React.Fragment key={group.id} />
      ))}
    </CommandGroup>
  );

};

const Names = ({page}) => {
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
  const { lang } = Language();
  const router = useRouter()
  const data = lang[id]

  return (
    <CommandItem
      key={id}
      onSelect={() => { router.push(`/${id}`) } }
      className="group cursor-pointer"
    >
      <div className="flex space-x-4">
        <div className="group-hover:text-cal-200 text-cal-500">#{id}</div>
        <div>
          <div className="flex group-hover:text-cal-200 text-cal-300">{data.purpose}</div>
          <div className="flex text-cal-500">{data.short}</div>
        </div>
      </div>
    </CommandItem>
  )

}