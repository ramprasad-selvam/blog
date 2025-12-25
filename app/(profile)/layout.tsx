// app/(profile)/layout.tsx
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <header className="py-8 border-b border-zinc-800 flex justify-between items-center mb-12">
        <div className="font-bold text-xl">My Portfolio</div>
        <nav className="space-x-6 text-zinc-400 text-sm">
          <a href="/portfolio" className="hover:text-white">Experience</a>
          <a href="/contact" className="hover:text-white">Contact</a>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}