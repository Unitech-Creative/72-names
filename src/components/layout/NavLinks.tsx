import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

export function NavLinks({ navLinks }) {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return navLinks.map((navLink, index) => (
    <NavLink
      key={index}
      index={index}
      hoveredIndex={hoveredIndex}
      setHoveredIndex={setHoveredIndex}
      {...navLink}
    />
  ));
}

function NavLink({
  href,
  label,
  admin,
  member,
  index,
  hoveredIndex,
  setHoveredIndex,
}) {
  const { data: session } = useSession();
  if (member && !session) return;
  if (admin && !!session?.user?.isAdmin === false) return;

  return (
    <Link
      href={href}
      className="relative -mx-3 rounded-lg px-3 py-1 text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900 hover:delay-[0ms]"
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <AnimatePresence>
        {hoveredIndex === index && (
          <motion.span
            className="absolute inset-0 rounded-lg bg-indigo-100"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
