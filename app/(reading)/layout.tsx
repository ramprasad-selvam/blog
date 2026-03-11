// app/(reading)/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      <div className="max-w-8xl mx-auto px-6 py-16">
        <header className="mb-16 flex justify-between items-center">
          <a href="/" className="font-bold border-b-2 border-black">Home</a>
          <span className="text-zinc-400 text-sm">Published Weekly</span>
        </header>
        <article className="prose prose-zinc prose-lg">{children}</article>
      </div>
    </div>
  );
}