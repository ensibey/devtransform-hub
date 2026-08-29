import React from 'react';
import Link from 'next/link';
import { FormatId, getAllMatrixPairs, FORMATS } from '@/lib/matrix';
import { ArrowRight, Code2, Sparkles, Layers } from 'lucide-react';

export interface RelatedToolsProps {
  currentFrom: FormatId;
  currentTo: FormatId;
}

export function RelatedTools({ currentFrom, currentTo }: RelatedToolsProps) {
  const allPairs = getAllMatrixPairs();

  // Find other pairs that convert FROM currentFrom
  const fromMatches = allPairs
    .filter((p) => p.from === currentFrom && p.to !== currentTo)
    .slice(0, 4);

  // Find other pairs that convert TO currentTo
  const toMatches = allPairs
    .filter((p) => p.to === currentTo && p.from !== currentFrom)
    .slice(0, 4);

  return (
    <section className="mt-12 border-t border-border pt-10 text-zinc-300">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-surface-100 border border-border text-xs font-mono text-sky-400">
            <Layers className="w-3.5 h-3.5" />
            <span>Contextual Converter Cluster</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Related Converters & Formats
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Explore parallel conversion routes for {FORMATS[currentFrom]?.name} and {FORMATS[currentTo]?.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Outbound from currentFrom */}
          <div className="space-y-3 p-4 rounded-xl bg-surface-100 border border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-300 flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Convert {FORMATS[currentFrom]?.shortName} into Other Formats</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fromMatches.map((pair) => (
                <Link
                  key={pair.slug}
                  href={`/${pair.slug}/`}
                  className="p-3 rounded-lg bg-surface-200 hover:bg-surface-300 border border-border hover:border-zinc-500 transition-all flex items-center justify-between text-xs group"
                >
                  <span className="text-zinc-200 group-hover:text-white font-medium">
                    {pair.fromMeta.shortName} → {pair.toMeta.shortName}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-brand-emerald group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Inbound to currentTo */}
          <div className="space-y-3 p-4 rounded-xl bg-surface-100 border border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Convert into {FORMATS[currentTo]?.shortName} from Other Sources</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {toMatches.map((pair) => (
                <Link
                  key={pair.slug}
                  href={`/${pair.slug}/`}
                  className="p-3 rounded-lg bg-surface-200 hover:bg-surface-300 border border-border hover:border-zinc-500 transition-all flex items-center justify-between text-xs group"
                >
                  <span className="text-zinc-200 group-hover:text-white font-medium">
                    {pair.fromMeta.shortName} → {pair.toMeta.shortName}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
