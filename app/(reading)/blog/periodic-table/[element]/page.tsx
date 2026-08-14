'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { Elements } from '../elements';

export default function ElementDetail({ params }: { params: Promise<{ element: string }> }) {
  const { element } = use(params);
  const data = Elements.elements.find((e) => e.symbol.toLowerCase() === element.toLowerCase());

  if (!data) return notFound();

  const elementIndex = Elements.elements.findIndex((item) => item.number === data.number);
  const previous = Elements.elements[elementIndex - 1];
  const next = Elements.elements[elementIndex + 1];

  return (
    <main className="reading-detail min-h-screen bg-white text-zinc-900 p-3 font-sans selection:bg-sky-100 selection:text-sky-900 sm:p-6">
      <div className="max-w-[85%] mx-auto">

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6 h-[500px] border border-zinc-100 bg-zinc-50/50 rounded-3xl relative flex items-center justify-center overflow-hidden shadow-inner">
            <AtomicModel protons={data.number} shells={data.shells} />
            <div className="absolute bottom-8 right-8 text-right opacity-30 pointer-events-none">
              <span className="text-[10px] block font-bold tracking-widest text-zinc-500">PHASE_STATUS</span>
              <span className="text-5xl font-black uppercase text-zinc-900">{data.phase}</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-sky-600 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-tighter">No. {data.number}</span>
              <span className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase">/ / {data.category}</span>
            </div>
            <h1 className="text-9xl font-black italic tracking-tighter leading-none mb-2 text-zinc-950">{data.symbol}</h1>
            <h2 className="text-3xl font-bold text-zinc-600 uppercase tracking-widest mb-8">{data.name}</h2>
            <p className="text-zinc-700 leading-relaxed text-base border-l-4 border-sky-600 pl-6 max-w-xl font-medium">{data.summary}</p>
          </div>
        </div>

        {/* IONIZATION PROFILE SECTION */}
        {data.ionization_energies && <div className="mb-12">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Ionization_Energy_Profile</h3>
          <IonizationGraph energies={data.ionization_energies} />
        </div>}

        {/* DETAILED PROPERTIES GRID */}
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Technical_Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-zinc-100 pt-12 pb-12">
          <FactBox title="Atomic Mass" value={`${data.atomic_mass} u`} desc="Weighted average mass based on isotope abundance." />
          <FactBox title="Density" value={`${data.density} g/cm³`} desc={<span>Mass per unit volume (g/cm<sup>3</sup>) at standard conditions.</span>} />
          <FactBox title="Molar Heat" value={`${data.molar_heat} J/(mol·K)`} desc="Heat energy required to raise temp of one mole." />
          <FactBox
            title="Electron Config"
            value={data.electron_configuration ? formatElectronConfig(data.electron_configuration) : 'N/A'}
            desc="Distribution of electrons in orbital subshells."
          />
          <FactBox title="Electronegativity" value={data.electronegativity_pauling || 'N/A'} desc="Atom's tendency to attract shared electron pairs." />
          <FactBox title="Melting Point" value={data.melt ? `${data.melt} K` : 'N/A'} desc="Transition temp from solid to liquid." />
          <FactBox title="Boiling Point" value={data.boil ? `${data.boil} K` : 'N/A'} desc="Temp where vapor pressure equals external pressure." />
          <FactBox
            title="Discovery"
            value={data.discovered_by || 'Ancient'}
            desc={data.discovered_by ? `Formally isolated by ${data.discovered_by}.` : "Known since antiquity."}
          />
          <FactBox title="Named By" value={data.named_by || 'N/A'} desc={`Nomenclature credited to ${data.named_by}.`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
          <div className="p-6 bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Sample_Visual</h4>
            <div className="aspect-video relative rounded-lg overflow-hidden bg-black flex items-center justify-center">
              {data.image ? (
                <img src={data.image.url} alt={data.image.title} className="w-full h-auto opacity-80" />
              ) : (
                <div className="text-zinc-700 text-[10px]">NO_IMAGE_DATA_AVAILABLE</div>
              )}
            </div>
          </div>
        </div>

        <nav aria-label="Element navigation" className="flex flex-col gap-3 border-t border-zinc-200 pt-6 pb-6 sm:flex-row sm:items-center sm:justify-between">
          {previous ? (
            <Link href={`/blog/periodic-table/${previous.symbol.toLowerCase()}`} className="group rounded-xl border border-zinc-200 px-4 py-3 transition hover:border-sky-400 hover:bg-sky-50">
              <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Previous element</span>
              <span className="mt-1 block text-sm font-bold text-zinc-800 group-hover:text-sky-700">{previous.number}. {previous.name} ({previous.symbol})</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={`/blog/periodic-table/${next.symbol.toLowerCase()}`} className="group rounded-xl border border-zinc-200 px-4 py-3 text-left transition hover:border-sky-400 hover:bg-sky-50 sm:text-right">
              <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Next element</span>
              <span className="mt-1 block text-sm font-bold text-zinc-800 group-hover:text-sky-700">{next.number}. {next.name} ({next.symbol})</span>
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}

/* --- COMPONENTS --- */

function IonizationGraph({ energies }: { energies: number[] }) {
  if (!energies || energies.length === 0) return null;

  const maxEnergy = Math.max(...energies);
  const firstEnergy = energies[0];
  const maxIndex = energies.indexOf(maxEnergy);
  const containerHeight = 200;

  const getShellJumpIndex = () => {
    let maxRatio = 0;
    let jumpIndex = -1;
    for (let i = 0; i < energies.length - 1; i++) {
      const ratio = energies[i + 1] / energies[i];
      if (ratio > maxRatio) {
        maxRatio = ratio;
        jumpIndex = i;
      }
    }
    return jumpIndex;
  };

  const jumpAt = getShellJumpIndex();

  return (
    <section className="ionization-panel overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl sm:p-8" aria-labelledby="ionization-title">
      <div className="mb-8 flex flex-col gap-5 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">Energy sequence</p>
          <h3 id="ionization-title" className="text-xl font-black tracking-tight text-white sm:text-2xl">Ionization energy profile</h3>
          <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-400">The energy required to remove each successive electron. A sharp rise indicates that the next electron belongs to a more tightly bound shell.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-right sm:min-w-[230px]">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">First electron</span>
            <strong className="mt-1 block text-sm text-sky-300">{firstEnergy.toLocaleString()} kJ/mol</strong>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">Highest shown</span>
            <strong className="mt-1 block text-sm text-rose-300">{maxEnergy.toLocaleString()} kJ/mol</strong>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[560px] items-end gap-3 border-b border-zinc-800/80 pb-2 h-64">
        {energies.map((energy, i) => {
          const height = (energy / maxEnergy) * containerHeight;
          const isCore = i > jumpAt;

          return (
            <div key={i} className="group relative flex min-w-8 flex-1 flex-col items-center" aria-label={`Electron ${i + 1}: ${energy.toLocaleString()} kilojoules per mole`}>
              <div className="pointer-events-none absolute -top-12 z-20 whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-black text-zinc-900 opacity-0 shadow-xl transition group-hover:opacity-100">
                {energy.toLocaleString()} kJ/mol
              </div>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 4)}px` }}
                transition={{ duration: 1, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full rounded-t-md shadow-lg ${isCore ? 'bg-rose-500 shadow-rose-500/20' : 'bg-sky-500 shadow-sky-500/20'
                  }`}
              />

              <span className={`mt-4 text-[9px] font-black uppercase tracking-tighter ${isCore ? 'text-rose-400' : 'text-sky-400'}`}>
                e⁻{i + 1}
              </span>

              {i === jumpAt && energies.length > 1 && (
                <div className="absolute -right-[7px] bottom-8 h-64 w-px border-r border-dashed border-rose-400/60" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-sky-500 rounded-full" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Valence</span>
          </div>
          {jumpAt !== -1 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Core_Jump</span>
            </div>
          )}
        </div>
        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Scale: relative linear</p>
      </div>
      {jumpAt !== -1 && <p className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-xs leading-5 text-zinc-400"><strong className="text-rose-300">Shell jump after e⁻{jumpAt + 1}.</strong> The next electron requires substantially more energy, revealing a new inner shell boundary.</p>}
    </section>
  );
}
function AtomicModel({ protons, shells }: { protons: number; shells: number[] }) {
  const shellCount = shells.length;
  const ringGap = 42;
  const nucleusSize = 56;
  const unscaledWidth = (shellCount * ringGap * 2) + nucleusSize + 40;
  const containerSize = 460;
  const scaleFactor = unscaledWidth > containerSize ? containerSize / unscaledWidth : 1;

  return (
    <motion.div
      key={protons}
      initial={{ opacity: 0, scale: scaleFactor * 0.9 }}
      animate={{ opacity: 1, scale: scaleFactor }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex items-center justify-center"
    >
      <div className="relative z-10 w-14 h-14 flex items-center justify-center">
        <div className="absolute inset-0 bg-sky-600 rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="bg-sky-600 w-full h-full rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <span className="text-white font-extrabold text-xl z-20">{protons}</span>
        </div>
      </div>

      {shells.map((count: number, i: number) => {
        const currentRingRadius = (i + 1) * ringGap + (nucleusSize / 2);
        return (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20 + i * 8, ease: "linear" }}
            className="absolute border border-zinc-200 rounded-full"
            style={{ width: currentRingRadius * 2, height: currentRingRadius * 2 }}
          >
            {[...Array(count)].map((_, eIdx) => (
              <div
                key={eIdx}
                className="absolute w-3 h-3 bg-sky-500 rounded-full shadow-sm border-2 border-white"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${(eIdx * 360) / count}deg) translate(${currentRingRadius}px)`
                }}
              />
            ))}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
const formatElectronConfig = (config: string) => {
  return config.split(" ").map((part, i) => {
    const match = part.match(/^(\d[a-z])(\d+)$/i);
    return match ? (
      <span key={i}>{match[1]}<sup>{match[2]}</sup> </span>
    ) : (
      <span key={i}>{part} </span>
    );
  });
}
function FactBox({ title, value, desc }: {
  title: string;
  value: string | number | null | React.ReactNode;
  desc: string | React.ReactNode;
}) {
  return (
    <div className="group p-6 bg-zinc-50/50 border border-zinc-100 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            {title}
          </span>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-black text-zinc-950 tracking-tighter break-words leading-tight">
              {value ?? '—'}
            </span>
          </div>
        </div>
      </div>
      <p className="text-[11px] leading-relaxed text-zinc-500 font-medium border-t border-zinc-100 ">
        {desc}
      </p>
    </div>
  );
}