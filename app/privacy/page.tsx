import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - 100% Client-Side Zero Data Collection | DevTransform',
  description:
    'DevTransform Privacy Policy. We do not store, log, track, or transmit your code, data, or files. Everything runs locally inside your browser.',
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/privacy/',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 leading-relaxed text-slate-700 dark:text-zinc-300">
      <div className="mb-8 border-b border-slate-200 dark:border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4" />
          Zero-Knowledge Data Policy
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Last Updated: September 2026 • Applies globally to all visitors
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 mb-8">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-sm mb-1">The Plain English Guarantee</h2>
            <p className="text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">
              DevTransform is architected with a strict <strong>Zero-Server Data Processing</strong> standard. When you paste JSON, format SQL, decode JWT tokens, or compress images, <strong>none of that data is ever sent to our servers</strong>. It is processed entirely in your web browser&apos;s memory using local JavaScript and WebAssembly.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 text-sm">
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            1. Information We Do NOT Collect
          </h2>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-zinc-400">
            <li>We do NOT collect, inspect, or log your input code, payloads, or database queries.</li>
            <li>We do NOT collect API keys, private certificates, or secrets pasted into formatters.</li>
            <li>We do NOT upload or store any files you select in image or document converters.</li>
            <li>We do NOT require user account creation, emails, or personal identification.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            2. Local Storage and Client Preferences
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
            We use browser <code className="text-xs font-mono bg-slate-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-slate-800 dark:text-zinc-200">localStorage</code> solely to remember your UI preferences:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 mt-2 text-slate-600 dark:text-zinc-400">
            <li>Dark mode / Light mode theme selection.</li>
            <li>Dismissal status of the bookmark reminder.</li>
            <li>Last active tab on dual-mode tools for your convenience.</li>
          </ul>
          <p className="text-slate-600 dark:text-zinc-400 mt-2">
            This data never leaves your device and can be cleared at any time via your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            3. Web Analytics & Hosting Telemetry
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
            DevTransform is hosted on modern edge infrastructure (Vercel). Like standard web servers, basic HTTP request logs (IP address, user agent, requested URL) may be generated for DDoS mitigation and routing. We do not correlate server-level network requests with any user activity.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            4. GDPR & CCPA Compliance
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
            Because DevTransform does not store, monetize, or sell personal data or identifiable code artifacts, we are inherently compliant by design with the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
          </p>
        </section>

        <section className="pt-4 border-t border-slate-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Questions or Security Inquiries?
          </h2>
          <p className="text-slate-600 dark:text-zinc-400">
            For questions regarding our privacy architecture, open an issue on our GitHub repository or contact our team via our <Link href="/contact/" className="text-emerald-500 underline font-medium">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}