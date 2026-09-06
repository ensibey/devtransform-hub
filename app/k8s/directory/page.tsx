import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllK8sRecipes } from '@/lib/k8s-recipes-data';
import { K8sDirectoryClient } from '@/components/k8s/K8sDirectoryClient';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import {
  Box,
  Terminal,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Code2,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kubernetes kubectl Command Recipes & Solutions Hub (2025/2026 DevOps Cheatsheet) | DevTransform',
  description: 'Verified kubectl command recipes for Kubernetes engineers. Includes interactive parameter customizers, port-forwarding, container exec, CrashLoopBackOff debugging, zero-downtime rollouts, and node draining.',
  keywords: [
    'kubectl command recipes',
    'kubernetes cheatsheet',
    'kubectl port-forward pod service',
    'kubectl exec interactive bash',
    'debug crashloopbackoff kubernetes',
    'kubectl rollout restart deployment',
    'force delete terminating pod',
    'kubectl top pods memory cpu',
    'devops kubernetes tutorial',
  ],
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/k8s/directory/',
  },
  openGraph: {
    title: 'Kubernetes kubectl Command Recipes & Solutions Hub | DevTransform',
    description: 'Instant CLI recipes for Kubernetes: port-forwarding, container exec, CrashLoopBackOff fixes, and rollout restarts.',
    url: 'https://devtransform-hub.vercel.app/k8s/directory/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kubernetes kubectl Command Recipes & Solutions Hub',
    description: 'Instant CLI recipes for Kubernetes: port-forwarding, container exec, CrashLoopBackOff fixes, and rollout restarts.',
  },
};

export default function K8sDirectoryPage() {
  const recipes = getAllK8sRecipes();

  const directoryFaqs = [
    {
      question: 'What is the fastest way to debug a pod in CrashLoopBackOff?',
      answer: 'First run `kubectl logs <pod> -n <ns> --previous` to inspect the exit code and application stack trace immediately before it crashed. Next, run `kubectl describe pod <pod> -n <ns>` to inspect Kubelet events for OOMKilled (Exit Code 137) or liveness probe failures.'
    },
    {
      question: 'How do I restart a deployment without changing the Docker image tag or causing downtime?',
      answer: 'Run `kubectl rollout restart deployment/<deployment-name> -n <ns>`. This triggers an orderly rolling replacement where new pods pass readiness probes before old pods receive termination signals.'
    },
    {
      question: 'What is the difference between kubectl port-forward and exposing a service?',
      answer: '`kubectl port-forward` creates a temporary encrypted local tunnel over the Kubernetes API server connection. It does not alter cluster ingress, does not create public cloud load balancers, and terminates as soon as you close your terminal.'
    },
    {
      question: 'How do I avoid typing -n <namespace> on every single kubectl command?',
      answer: 'Set your default namespace for the current context with: `kubectl config set-context --current --namespace=<your-namespace>`.'
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kubernetes kubectl Command Recipes & Solutions Hub',
    description: 'Curated collection of verified kubectl commands and debugging workflows for Kubernetes operators and developers.',
    url: 'https://devtransform-hub.vercel.app/k8s/directory/',
    author: {
      '@type': 'Organization',
      name: 'DevTransform Hub',
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-sky-400 font-medium">Kubernetes Directory</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Box className="w-3.5 h-3.5" />
            <span>DevOps &amp; Cloud Infrastructure Reference</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Kubernetes kubectl Recipes &amp; Solutions
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Everyday battle-tested commands for Kubernetes developers, SREs, and cluster administrators. Port-forward internal services, exec into debugging shells, resolve CrashLoopBackOff failures, and execute rolling restarts with zero downtime.
          </p>
        </div>

        {/* Directory Grid */}
        <K8sDirectoryClient recipes={recipes} />

        {/* Pod Lifecycle & Error States Matrix */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Kubernetes Pod Troubleshooting Decision Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Common failure states and recommended diagnostic commands
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="pb-3 font-semibold">Pod State</th>
                  <th className="pb-3 font-semibold">Probable Root Cause</th>
                  <th className="pb-3 font-semibold">Diagnostic Command</th>
                  <th className="pb-3 font-semibold">Recommended Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                <tr>
                  <td className="py-3 text-rose-400 font-sans font-medium">CrashLoopBackOff</td>
                  <td className="py-3 text-slate-400 font-sans">App threw fatal exception or OOM killed</td>
                  <td className="py-3 text-sky-400">kubectl logs --previous</td>
                  <td className="py-3 text-slate-400 font-sans">Fix app code, verify env secrets, bump memory limits</td>
                </tr>
                <tr>
                  <td className="py-3 text-amber-400 font-sans font-medium">ImagePullBackOff</td>
                  <td className="py-3 text-slate-400 font-sans">Registry 404, invalid tag, missing imagePullSecrets</td>
                  <td className="py-3 text-sky-400">kubectl describe pod</td>
                  <td className="py-3 text-slate-400 font-sans">Verify Docker repository name & registry auth token</td>
                </tr>
                <tr>
                  <td className="py-3 text-sky-400 font-sans font-medium">Pending</td>
                  <td className="py-3 text-slate-400 font-sans">Insufficient CPU/memory on nodes, taint mismatch</td>
                  <td className="py-3 text-sky-400">kubectl describe pod</td>
                  <td className="py-3 text-slate-400 font-sans">Add cluster worker nodes or reduce resource requests</td>
                </tr>
                <tr>
                  <td className="py-3 text-purple-400 font-sans font-medium">Terminating (Stuck)</td>
                  <td className="py-3 text-slate-400 font-sans">Dead node, volume unmount lock, blocking finalizer</td>
                  <td className="py-3 text-sky-400">kubectl delete pod --force</td>
                  <td className="py-3 text-slate-400 font-sans">Force delete with grace-period=0 or patch finalizers</td>
                </tr>
                <tr>
                  <td className="py-3 text-yellow-400 font-sans font-medium">OOMKilled (Exit 137)</td>
                  <td className="py-3 text-slate-400 font-sans">Process exceeded cgroup memory limit</td>
                  <td className="py-3 text-sky-400">kubectl top pod</td>
                  <td className="py-3 text-slate-400 font-sans">Increase resources.limits.memory in Deployment YAML</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">
            Frequently Asked Questions About Kubernetes kubectl Commands
          </h2>
          <FaqAccordion faqs={directoryFaqs} />
        </div>
      </div>
    </div>
  );
}
