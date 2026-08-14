"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  tools: "Tools",
  code: "Code Studio",
  metal: "Metal Terminal",
  converter: "Unit Forge",
  diff: "Diff Checker",
  clock: "World Clock",
  "json-table": "JSON Inspector",
  calc: "Loan Solver",
  image: "Asset Creator",
  share: "QR Code Studio",
};

export default function ToolsBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="mx-auto mb-5 flex max-w-7xl min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap px-1 text-[11px] font-semibold text-zinc-500 sm:mb-7 sm:px-2">
      <Link href="/" className="shrink-0 transition hover:text-blue-500">Home</Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isCurrent = index === segments.length - 1;
        return (
          <span key={href} className="flex shrink-0 items-center gap-2">
            <span aria-hidden="true" className="text-zinc-300">/</span>
            {isCurrent ? (
              <span aria-current="page" className="text-zinc-700">{labels[segment] || segment}</span>
            ) : (
              <Link href={href} className="transition hover:text-blue-500">{labels[segment] || segment}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
