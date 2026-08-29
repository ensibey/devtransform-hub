import React from 'react';
import { FormatDetail, ComparisonFeature } from '@/lib/seo-data';
import { Layers, ExternalLink } from 'lucide-react';

export interface TechnicalComparisonProps {
  fromDetail: FormatDetail;
  toDetail: FormatDetail;
  comparisonTable: ComparisonFeature[];
}

export function TechnicalComparison({
  fromDetail,
  toDetail,
  comparisonTable,
}: TechnicalComparisonProps) {
  return (
    <section className="mt-12 border-t border-border pt-10 text-zinc-300">
      <div className="space-y-6">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-surface-100 border border-border text-xs font-mono text-brand-emerald">
            <Layers className="w-3.5 h-3.5" />
            <span>Format Specification Comparison</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {fromDetail.shortName} vs {toDetail.shortName}: Technical Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Direct architectural and specification comparison between {fromDetail.name} and {toDetail.name} standards.
          </p>
        </div>

        {/* Structured Comparison Table */}
        <div className="rounded-xl border border-border overflow-hidden bg-surface-100 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-200 text-zinc-400 font-mono border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-semibold text-zinc-300">Technical Metric</th>
                  <th className="px-4 py-3 font-semibold text-zinc-200">
                    {fromDetail.shortName} ({fromDetail.extension})
                  </th>
                  <th className="px-4 py-3 font-semibold text-brand-emerald">
                    {toDetail.shortName} ({toDetail.extension})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {comparisonTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-300 bg-surface-200/30">
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 text-zinc-300 font-sans leading-relaxed">
                      {row.fromValue}
                    </td>
                    <td className="px-4 py-3 text-zinc-200 font-medium font-sans leading-relaxed">
                      {row.toValue}
                    </td>
                  </tr>
                ))}

                {/* Standards & Spec URLs */}
                <tr className="hover:bg-surface-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-300 bg-surface-200/30">
                    Official Specification
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    <a
                      href={fromDetail.specificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      <span>{fromDetail.shortName} Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    <a
                      href={toDetail.specificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-brand-emerald hover:text-emerald-300 transition-colors"
                    >
                      <span>{toDetail.shortName} Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
