import type { Metadata } from 'next';
import { FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | DevTransform',
  description: 'Terms of Service for using DevTransform developer tools and utilities.',
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/terms/',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 leading-relaxed text-slate-700 dark:text-zinc-300">
      <div className="mb-8 border-b border-slate-200 dark:border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <FileText className="w-4 h-4" />
          Legal Terms
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Effective Date: September 2026
        </p>
      </div>

      <div className="space-y-8 text-sm">
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            1. Acceptance of Terms
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
            By accessing and using DevTransform (devtransform-hub.vercel.app), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            2. Permitted Use & Commercial Freedom
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
            DevTransform provides free, open utilities for software developers, engineers, and digital creators. You are free to use these tools for personal, academic, open-source, and commercial projects without licensing fees or attribution requirements for output code.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            3. Intellectual Property of Your Content
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
            You retain 100% ownership and copyright of any code, SQL queries, images, schemas, or data you input into DevTransform. DevTransform does not claim any rights, title, or interest in your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            4. Disclaimer of Warranties
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
            DevTransform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. While we strive for absolute precision in all converters and formatters, we cannot guarantee that mathematical conversions, timezone calculations, or syntax parsing will be completely free of errors in all edge cases. Always verify generated code before deploying to mission-critical production systems.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            5. Limitation of Liability
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
            In no event shall DevTransform or its contributors be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the tools.
          </p>
        </section>
      </div>
    </div>
  );
}