"use client";

import { useState, useMemo } from "react";
import { 
  Search, ChevronLeft, ChevronRight, ArrowUpDown, Code2, 
  AlertCircle, Download, Trash2, Filter,
  Maximize2, Minimize2, Eye, EyeOff 
} from "lucide-react";

export default function JsonInspectorPage() {
  // --- 1. STATE MANAGEMENT ---
  const [rawJson, setRawJson] = useState<string>(JSON.stringify([
    { id: 1, name: "Alpha Project", manager: "Sarah", status: "Active", budget: 12000, region: "NA" },
    { id: 2, name: "Beta System", manager: "James", status: "Delayed", budget: 45000, region: "EU" },
    { id: 3, name: "Gamma Portal", manager: "Sarah", status: "Active", budget: 8500, region: "APAC" },
    { id: 4, name: "Delta API", manager: "Lin", status: "Testing", budget: 15000, region: "NA" },
    { id: 5, name: "Epsilon App", manager: "James", status: "Active", budget: 32000, region: "EU" },
    { id: 6, name: "Zeta Tool", manager: "Lin", status: "Archived", budget: 5000, region: "NA" },
  ], null, 2));

  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  // --- 2. DATA PROCESSING ---
  const { data, headers, error } = useMemo(() => {
    try {
      const parsed = JSON.parse(rawJson);
      if (!Array.isArray(parsed)) throw new Error("Input must be a JSON Array");
      return { data: parsed, headers: Object.keys(parsed[0] || {}), error: null };
    } catch (e: any) {
      return { data: [], headers: [], error: e.message };
    }
  }, [rawJson]);

  const toggleColumn = (col: string) => {
    setHiddenColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
  };

  const visibleHeaders = useMemo(() => 
    headers.filter(h => !hiddenColumns.includes(h)), 
  [headers, hiddenColumns]);

  const processedData = useMemo(() => {
    let result = data.filter(row => {
      const matchGlobal = Object.values(row).some(v => 
        String(v).toLowerCase().includes(globalSearch.toLowerCase())
      );
      const matchColumns = Object.keys(columnFilters).every(key => 
        !columnFilters[key] || String(row[key] || "").toLowerCase().includes(columnFilters[key].toLowerCase())
      );
      return matchGlobal && matchColumns;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, globalSearch, columnFilters, sortConfig]);

  // --- 3. PAGINATION HELPERS ---
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const hasActiveFilters = Boolean(globalSearch || Object.values(columnFilters).some(Boolean));

  // --- 4. EXPORT FUNCTION ---
  const exportCSV = () => {
    if (processedData.length === 0) return;
    const csvHeaders = visibleHeaders.join(",");
    const csvRows = processedData.map(row => 
      visibleHeaders.map(h => {
        const val = row[h] ?? "";
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(",")
    );
    const blob = new Blob([[csvHeaders, ...csvRows].join("\n")], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `devbox_data_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 animate-in fade-in duration-700 pb-16">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Data utility</p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">JSON Inspector</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">Turn a JSON array into a searchable, sortable workspace and export the result as CSV.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left sm:text-right">
          <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-600">Input format</span>
          <strong className="mt-1 block text-sm text-zinc-300">JSON array</strong>
        </div>
      </header>
      
      {/* SECTION: TOP JSON INPUT */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/60 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Code2 size={16} className="text-blue-500" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">JSON Source Data</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsEditorExpanded(!isEditorExpanded)} className="text-zinc-500 hover:text-white transition-colors">
              {isEditorExpanded ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
            </button>
            <button onClick={() => setRawJson("[]")} className="text-zinc-600 hover:text-red-400"><Trash2 size={14}/></button>
          </div>
        </div>
        <textarea 
          value={rawJson} onChange={(e) => { setRawJson(e.target.value); setCurrentPage(1); }}
          className={`w-full resize-none bg-black/20 p-4 font-mono text-[11px] outline-none transition-all duration-500 scrollbar-hide sm:p-6 ${isEditorExpanded ? 'h-[450px]' : 'h-[140px] sm:h-[170px]'}`}
          spellCheck={false}
          placeholder="Paste JSON array here..."
        />
        {error && <div className="px-8 py-2 bg-red-500/10 text-[10px] text-red-400 font-bold uppercase italic"><AlertCircle size={12} className="inline mr-2"/> {error}</div>}
      </section>

      {/* SECTION: DATA TABLE AREA */}
      <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-900/20 p-4 sm:p-6 lg:p-8">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
              <input 
                placeholder="Global filter..." value={globalSearch} 
                onChange={(e) => { setGlobalSearch(e.target.value); setCurrentPage(1); }}
                className="w-full bg-zinc-900/80 border border-white/5 py-3 pl-10 pr-4 rounded-2xl text-xs outline-none focus:ring-1 ring-blue-500/40"
              />
            </div>
            <select 
              value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-zinc-900/80 border border-white/5 text-[10px] font-bold py-3 px-4 rounded-2xl outline-none cursor-pointer"
            >
              {[5, 10, 25, 50].filter(n => n < processedData.length).map(n => <option key={n} value={n}>Show {n}</option>)}
              <option value={processedData.length}>Show All ({processedData.length})</option>
            </select>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {processedData.length} {processedData.length === 1 ? "record" : "records"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={exportCSV}
              disabled={processedData.length === 0}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={14} /> Export CSV
            </button>
            <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1.5 rounded-2xl border border-white/5">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-2 hover:bg-zinc-800 rounded-lg disabled:opacity-20"><ChevronLeft size={16}/></button>
              {pageNumbers.map(num => (
                <button 
                  key={num} onClick={() => setCurrentPage(num)}
                  className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${currentPage === num ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-800'}`}
                >
                  {num}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 hover:bg-zinc-800 rounded-lg disabled:opacity-20"><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>

        {/* Column Toggles */}
        <div className="flex flex-wrap items-center gap-2 border-y border-white/5 py-4">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest self-center mr-2">Columns:</span>
          {headers.map(h => (
            <button
              key={h} onClick={() => toggleColumn(h)}
              className={`px-3 py-1.5 rounded-full text-[9px] font-bold border transition-all flex items-center gap-2 ${hiddenColumns.includes(h) ? "bg-transparent border-zinc-800 text-zinc-600" : "bg-blue-600/10 border-blue-500/20 text-blue-400"}`}
            >
              {hiddenColumns.includes(h) ? <EyeOff size={10} /> : <Eye size={10} />} {h}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="rounded-[2.5rem] border border-white/5 bg-black/40 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left text-xs border-separate border-spacing-0">
              <thead className="sticky top-0 z-20">
                <tr className="bg-zinc-900/95 backdrop-blur-xl">
                  {visibleHeaders.map(h => (
                    <th key={h} className="p-6 font-black text-zinc-500 uppercase tracking-tighter border-b border-white/5">
                      <button onClick={() => setSortConfig({ key: h, direction: sortConfig?.direction === 'asc' ? 'desc' : 'asc' })} className="flex items-center gap-2 hover:text-white transition-colors">
                        {h} <ArrowUpDown size={12} className="opacity-30" />
                      </button>
                    </th>
                  ))}
                </tr>
                <tr className="bg-zinc-900/60 backdrop-blur-md">
                  {visibleHeaders.map(h => (
                    <td key={`f-${h}`} className="p-3 border-b border-white/5">
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={10} />
                        <input 
                          placeholder={`Filter ${h}...`}
                          value={columnFilters[h] || ""}
                          onChange={(e) => { setColumnFilters({...columnFilters, [h]: e.target.value}); setCurrentPage(1); }}
                          className="w-full bg-black/60 border border-white/5 py-2.5 pl-8 pr-3 rounded-xl text-[10px] outline-none focus:border-blue-500/40 font-mono"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, i) => (
                    <tr key={i} className="hover:bg-blue-500/[0.03] transition-colors group">
                      {visibleHeaders.map(h => (
                        <td key={h} className="p-6 text-zinc-400 font-mono tracking-tight group-hover:text-zinc-200">
                          {typeof row[h] === 'object' ? JSON.stringify(row[h]) : String(row[h])}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={visibleHeaders.length} className="p-20 text-center">
                    <p className="text-sm font-bold text-zinc-400">No matching records</p>
                    <p className="mt-1 text-xs text-zinc-600">{hasActiveFilters ? "Try clearing a filter or searching for another value." : "Paste a JSON array above to populate this table."}</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}