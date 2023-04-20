import Link from "next/link";

export default function SanityLink(path, tooltipContent, className = "") {
  const url = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL + path;

  return (
    <Link
      target="_blank"
      href={url}
      title={tooltipContent}
      className={className}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-red-600">
        <div className="text-sm text-white">S</div>
      </div>
    </Link>
  );
}
