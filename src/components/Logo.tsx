import clsx from "clsx";

export interface LogoProps { className?: string; }

export function Logo({ className }: LogoProps) {
  return (
    <div className={clsx("font-serif text-xl font-bold text-cal-600", className)}>
      72 Names of God
    </div>
  );
}
