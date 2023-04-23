import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

import {
  Command,
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





export function CommandDemo() {
  return (
    <Command className="rounded-lg border border-cal-500">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="max-h-[500px]">
        <CommandEmpty>No results found.</CommandEmpty>
        <Suggestions />
        <CommandSeparator />
        <Names />
      </CommandList>
    </Command>
  );
}

const Suggestions = () => {
  const groups = ["Love", "Healing", "Money", "Sharing", "Ego", "Repentence"];

  return (
    <CommandGroup heading="Suggestions">
      {groups.map((group) => (
        <CommandItem>
          <Calendar className="mr-2 h-4 w-4" />
          <span>{group}</span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

const Names = () => {
  const { lang } = Language();
  const router = useRouter()
  const names = Object.entries(lang).map(([key, data]) => (


    <CommandItem onSelect={() => { router.push(`/${key}`) } }>
      <div className="flex space-x-4">
        <div className="text-cal-500">#{key}</div>
        <div>
          <div className="flex text-cal-200">{data.purpose}</div>
          <div className="flex text-cal-500">{data.short}</div>
        </div>
      </div>
    </CommandItem>
  ));

  return <CommandGroup heading="All Names">{names}</CommandGroup>;

}

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
