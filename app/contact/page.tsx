'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Github } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'tool_request',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    const subject = encodeURIComponent('[DevTransform ' + formData.type + '] from ' + (formData.name || 'User'));
    const body = encodeURIComponent('Type: ' + formData.type + '\nName: ' + formData.name + '\nEmail: ' + formData.email + '\n\nMessage:\n' + formData.message);
    
    window.location.href = 'mailto:contact@devtransform.com?subject=' + subject + '&body=' + body;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          Get In Touch
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact & Feature Requests
        </h1>
        <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-lg mx-auto">
          Have an idea for a new developer utility, noticed an edge case bug, or want to collaborate? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4 md:col-span-1">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
              <Github className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              GitHub Issues
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
              For bug reports, technical discussions, and code pull requests.
            </p>
            <a
              href="https://github.com/ensibey/devtransform-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:text-emerald-600"
            >
              Open GitHub Repo →
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <Mail className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Direct Email
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-2">
              Inquiries, partnerships, and suggestions:
            </p>
            <span className="font-mono text-xs text-slate-800 dark:text-zinc-200 font-medium select-all">
              contact@devtransform.com
            </span>
          </div>
        </div>

        <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Thank You for Your Feedback!
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                Your message has been dispatched. If your email client didn&apos;t open automatically, you can always reach us directly via GitHub issues.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Developer"
                    className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                  Message Category
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="tool_request">Suggest a New Tool</option>
                  <option value="bug_report">Report a Bug / Glitch</option>
                  <option value="general_feedback">General Feedback</option>
                  <option value="partnership">Collaboration / Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe the tool you need or the issue you found..."
                  className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl p-3.5 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                Send Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}