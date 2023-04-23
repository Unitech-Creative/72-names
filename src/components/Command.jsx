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





export function CommandDemo() {
  const groups = ['Love', 'Healing', 'Money', 'Sharing', 'Ego', 'Repentence']
  const { locale, lang, Pronounced } = Language();


  return (
    <Command className="rounded-lg border border-cal-500">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="max-h-[500px]" >
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {groups.map((group) => (
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>{group}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="All Names">
          <Names />
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

const Names = () => {
  const { locale, lang, Pronounced } = Language();


  return Object.entries(lang).map(([key, data]) => (
    <CommandItem>
      <div className="flex space-x-4">
        <div className="">#{key}</div>

        <div>
          <div className="flex text-cal-300">
            {data.purpose}
          </div>
          <div className="flex text-cal-500">
            {data.short}
          </div>
        </div>

      </div>
    </CommandItem>
  ));

}
