"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export default function PiInfiniteScroll() {
  const [digitChunks, setDigitChunks] = useState<{ start: number; content: string }[]>([]);
  const [jumpValue, setJumpValue] = useState<string>("");
  const [startOffset, setStartOffset] = useState<number>(jumpValue ? Number(jumpValue) : 0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchPiDigits = useCallback(async (currentStart: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.pi.delivery/v1/pi?start=${currentStart}&numberOfDigits=1000&radix=10`
      );
      const data = await response.json();

      if (data.content) {
        setDigitChunks((prev) => [...prev, { start: currentStart, content: data.content }]);
        setStartOffset(currentStart + 1000);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching Pi:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // Handle manual jump
  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const newStart = jumpValue ? parseInt(jumpValue) : 0;
    setDigitChunks([]); // Clear existing list
    setHasMore(true);
    setStartOffset(newStart);
    fetchPiDigits(newStart);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPiDigits(startOffset);
        }
      },
      { threshold: 0.1, rootMargin: "300px" }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [fetchPiDigits, startOffset, hasMore, loading]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-mono">
      <div className="max-w-8xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-2">π Explorer</h1>
          <p className="text-slate-500 mb-8">Visualize 100,000,000,000,000 digits of <b>Pie</b></p>

          {/* Jump to Position Input */}
          <form onSubmit={handleJump} className="flex max-w-sm mx-auto gap-2">
            <input
              type="number"
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              placeholder="Start digit from..."
              min={0}
              max={100000000000000}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
            >
              Jump
            </button>
          </form>
        </header>

        <div className="space-y-8">
          {digitChunks.map((chunk, index) => (
            <div
              key={`${chunk.start}-${index}`}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 break-all leading-relaxed text-slate-700 relative pt-8"
            >
              <div className="absolute -top-3 left-4 bg-slate-800 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border-2 border-white shadow-sm">
                Digits {(chunk.start).toLocaleString()} - {(chunk.start + chunk.content.length - 1).toLocaleString()}
              </div>

              {/* Only show "3." if we are literally at index 0 */}
              {chunk.start === 0 ? (
                <span>
                  <span className="text-2xl font-bold text-blue-600">3.</span>
                  {chunk.content.substring(1)}
                </span>
              ) : (
                chunk.content
              )}
            </div>
          ))}
        </div>

        {/* Loading / Sentinel Element */}
        <div ref={observerTarget} className="flex flex-col items-center justify-center py-20">
          {loading && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm animate-pulse">Fetching digits...</p>
            </div>
          )}
          {!hasMore && (
            <p className="text-slate-400 bg-slate-200 px-4 py-2 rounded-full text-sm">
              End of Pi sequence reached.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}