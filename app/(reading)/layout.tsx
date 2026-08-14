import Link from 'next/link';
import Breadcrumbs from './Breadcrumbs';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="reading-shell min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-5 sm:mb-10">
          <Link href="/blog" className="font-bold tracking-tight hover:text-blue-600">Journal</Link>
          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400 sm:gap-6">
            <Link href="/blog" className="hover:text-blue-600">All articles</Link>
            <span className="hidden sm:inline">Published Weekly</span>
          </div>
        </header>
        <Breadcrumbs />
        <div>{children}</div>
      </div>
    </div>
  );
}