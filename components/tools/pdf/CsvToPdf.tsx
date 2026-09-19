'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { downloadBlob, formatBytes } from '@/lib/utils';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Search,
  Table as TableIcon
} from 'lucide-react';

const SAMPLE_CSV = `Employee Name,Department,Role,Salary,Start Date
Alex Morgan,Engineering,Senior Full Stack Lead,"$145,000",2022-03-15
Elena Rostova,Product,Head of UX Design,"$132,000",2021-08-01
David Chen,DevOps,Principal Cloud Architect,"$158,000",2020-11-10
Sarah Jenkins,Marketing,Growth Marketing Lead,"$98,000",2023-01-20
Marcus Vance,Security,SecOps & Pentest Specialist,"$140,000",2022-06-18
Priya Sharma,Data Science,AI & Machine Learning Eng,"$150,000",2021-04-12
Liam O'Connor,Engineering,Staff Backend Developer,"$138,000",2022-09-05`;

export function CsvToPdf() {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [docTitle, setDocTitle] = useState('Spreadsheet_Report');
  const [theme, setTheme] = useState<'modern' | 'minimal' | 'striped' | 'corporate'>('corporate');
  const [filterText, setFilterText] = useState('');
  const [fontSize, setFontSize] = useState<'10' | '12' | '14'>('12');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [copied, setCopied] = useState(false);

  // Parse CSV
  const parseResult = Papa.parse<string[]>(csvText.trim(), { skipEmptyLines: true });
  const data = parseResult.data || [];
  const headers = data.length > 0 ? data[0] : [];
  const rawRows = data.length > 1 ? data.slice(1) : [];

  // Filter rows
  const rows = rawRows.filter((row) => {
    if (!filterText.trim()) return true;
    return row.some((cell) => cell.toLowerCase().includes(filterText.toLowerCase()));
  });

  const handleFilesSelected = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setCsvText(text);
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(csvText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, `${docTitle}.csv`);
  };

  return (
    <div className="space-y-8">
      {/* Print Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-csv-table,
          #printable-csv-table * {
            visibility: visible;
          }
          #printable-csv-table {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Top Action Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="text-sm font-bold text-foreground bg-transparent border-b border-dashed border-border focus:border-emerald-500 focus:outline-none"
              placeholder="Table Title"
            />
            <p className="text-xs text-muted-foreground">
              {headers.length} Columns • {rows.length} Rows • 100% Client-Side
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="bg-background border border-border text-xs rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="corporate">Corporate Blue</option>
            <option value="modern">Emerald Dark/Light</option>
            <option value="striped">Striped Rows</option>
            <option value="minimal">Minimalist Border</option>
          </select>

          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as any)}
            className="bg-background border border-border text-xs rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="landscape">Landscape (Recommended)</option>
            <option value="portrait">Portrait</option>
          </select>

          <button
            onClick={handleCopyCsv}
            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy CSV'}
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            .CSV
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Save as PDF / Print
          </button>
        </div>
      </div>

      {/* Upload Dropzone Accordion */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <TableIcon className="w-4 h-4 text-emerald-500" />
            Upload File or Edit CSV Data Directly:
          </span>
          <button
            onClick={() => setCsvText(SAMPLE_CSV)}
            className="text-[11px] text-muted-foreground hover:text-emerald-500 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Sample
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <FileDropzone
              accept=".csv,.txt,.tsv"
              maxSizeMB={20}
              onFilesSelected={handleFilesSelected}
              title="Upload CSV / Excel Export"
              subtitle="Drag and drop your spreadsheet here"
            />
          </div>

          <div className="lg:col-span-2">
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={6}
              className="w-full bg-background border border-border rounded-xl p-3 text-xs font-mono text-foreground leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Paste comma-separated values here..."
            />
          </div>
        </div>
      </div>

      {/* Table Preview Section */}
      <div className="space-y-4">
        {/* Search inside table */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search table rows..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Showing {rows.length} of {rawRows.length} rows
          </span>
        </div>

        {/* Formatted Printable Sheet */}
        <div className="bg-muted/30 p-4 sm:p-6 rounded-2xl border border-border flex justify-center overflow-x-auto">
          <div
            id="printable-csv-table"
            className={`bg-white text-slate-900 shadow-xl rounded-sm p-8 ${
              orientation === 'landscape' ? 'w-[842px]' : 'w-[595px]'
            } min-h-[500px]`}
            style={{ fontSize: `${fontSize}pt` }}
          >
            <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{docTitle}</h1>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Generated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • {rows.length} Records
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Official Report
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr
                    className={
                      theme === 'corporate'
                        ? 'bg-blue-800 text-white'
                        : theme === 'modern'
                        ? 'bg-slate-900 text-white'
                        : theme === 'striped'
                        ? 'bg-slate-200 text-slate-900'
                        : 'border-b-2 border-slate-900 text-slate-900'
                    }
                  >
                    {headers.map((h, idx) => (
                      <th
                        key={idx}
                        className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider border-r border-white/20 last:border-r-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 text-xs">
                  {rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={
                        theme === 'striped' && rIdx % 2 === 1
                          ? 'bg-slate-50 hover:bg-slate-100'
                          : 'hover:bg-slate-50'
                      }
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
              <span>DevTransform Privacy Suite • Zero Server Data Storage</span>
              <span>Confidential Document</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Private In-Browser
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your payroll, customer data, and spreadsheets are parsed locally with PapaParse without touching cloud servers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Auto-Column Alignment
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Auto-detects delimiters (comma, semicolon, tabs) and dynamically distributes column widths for balanced print output.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Printer className="w-4 h-4 text-blue-400" />
            Landscape &amp; Portrait
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Easily toggle between landscape mode for wide tables and portrait for standard columnar documents.
          </p>
        </div>
      </div>
    </div>
  );
}
