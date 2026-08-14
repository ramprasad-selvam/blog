"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  blog: "Journal",
  pie: "Pi Explorer",
  "periodic-table": "Periodic Table",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const items = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = labels[segment] || (segments[index - 1] === "periodic-table" ? segment.toUpperCase() : segment);
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-8 flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap text-[11px] font-semibold text-zinc-400">
      <Link href="/" className="shrink-0 hover:text-blue-600">Home</Link>
      {items.map((item, index) => (
        <span key={item.href} className="flex shrink-0 items-center gap-2">
          <span aria-hidden="true" className="text-zinc-300">/</span>
          {index === items.length - 1 ? (
            <span aria-current="page" className="text-zinc-700">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-blue-600">{item.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}