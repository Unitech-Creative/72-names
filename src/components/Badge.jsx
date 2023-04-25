import clsx from "clsx";

export function Badge({color, children, className}) {
  let colorClassName;
  switch (color) {
    case "cal":
      colorClassName = "bg-cal-400/10 text-cal-400 ring-cal-400/20";
      break;
    case "gray":
      colorClassName = "bg-cal-600/10 text-cal-600 ring-cal-600/20";
      break;
    default:
      colorClassName = "bg-gray-400/10 text-gray-400 ring-gray-400/20";
  }

  return (
    <span className={clsx(`inline-flex items-center rounded-full px-2 text-xs font-medium ring-1 ring-inset ${colorClassName}`, className)}>
      {children}
    </span>
  )
}
