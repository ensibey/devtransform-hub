'use client';

import React, { useEffect, useRef } from 'react';
import { EditorState, Extension } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { linter, Diagnostic } from '@codemirror/lint';
import { json } from '@codemirror/lang-json';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';
import { FormatId } from '@/lib/matrix';

export interface CodeErrorDiagnostic {
  line?: number;
  column?: number;
  message: string;
}

export interface CodeMirrorEditorProps {
  value: string;
  onChange?: (val: string) => void;
  format: FormatId;
  readOnly?: boolean;
  errorDiagnostic?: CodeErrorDiagnostic | null;
  onFormatShortcut?: () => void;
  className?: string;
  placeholder?: string;
}

// OLED / Dark Linear Syntax Highlight Theme
const darkHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#c084fc', fontWeight: '600' }, // violet-400
  { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: '#60a5fa' }, // blue-400
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#38bdf8' }, // sky-400
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#f472b6' }, // pink-400
  { tag: [tags.definition(tags.name), tags.separator], color: '#e4e4e7' }, // zinc-200
  { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#34d399' }, // emerald-400
  { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, tags.special(tags.string)], color: '#f59e0b' }, // amber-500
  { tag: [tags.meta, tags.comment], color: '#71717a', fontStyle: 'italic' }, // zinc-500
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.link, color: '#60a5fa', textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: '#60a5fa' },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#f43f5e' }, // rose-500
  { tag: [tags.processingInstruction, tags.string, tags.inserted], color: '#a7f3d0' }, // emerald-200
  { tag: tags.invalid, color: '#ef4444' },
]);

// CodeMirror OLED Dark Editor Theme
const oledDarkTheme = EditorView.theme(
  {
    '&': {
      color: '#f4f4f5',
      backgroundColor: '#09090b',
      height: '100%',
      fontSize: '13px',
      fontFamily: 'var(--font-mono, JetBrains Mono, monospace)',
    },
    '.cm-scroller': {
      overflow: 'auto',
      fontFamily: 'inherit',
      lineHeight: '1.6',
    },
    '.cm-content': {
      caretColor: '#10b981',
      padding: '12px 0',
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#10b981',
      borderLeftWidth: '2px',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: '#27272a !important',
    },
    '.cm-gutters': {
      backgroundColor: '#050507',
      color: '#52525b',
      borderRight: '1px solid #18181b',
      paddingRight: '8px',
      userSelect: 'none',
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#121215',
      color: '#a1a1aa',
    },
    '.cm-activeLine': {
      backgroundColor: '#12121540',
    },
    '.cm-line': {
      padding: '0 16px',
    },
    '.cm-matchingBracket': {
      backgroundColor: '#3f3f4680',
      color: '#34d399 !important',
      outline: '1px solid #10b981',
    },
    '.cm-lint-marker-error': {
      content: 'none',
    },
    '.cm-lintRange-error': {
      backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="6" height="3">%3Cpath%20d%3D%22m0%202.5%20l2-2%20l2%202%20l2-2%22%20fill%3D%22none%22%20stroke%3D%22%23ef4444%22%20stroke-width%3D%221%22%2F%3E</svg>')`,
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'bottom left',
      paddingBottom: '2px',
    },
  },
  { dark: true }
);

function getLanguageExtension(format: FormatId): Extension {
  switch (format) {
    case 'json':
      return json();
    case 'typescript':
      return javascript({ typescript: true });
    case 'python':
      return python();
    case 'rust':
    case 'go':
      return rust();
    case 'sql':
      return sql();
    case 'xml':
      return xml();
    case 'yaml':
    case 'toml':
    case 'csv':
      return yaml();
    default:
      return json();
  }
}

export function CodeMirrorEditor({
  value,
  onChange,
  format,
  readOnly = false,
  errorDiagnostic = null,
  onFormatShortcut,
  className = '',
  placeholder = '',
}: CodeMirrorEditorProps) {
  const [mounted, setMounted] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Setup diagnostic linter for syntax errors
  const customLinter = linter((view) => {
    const diagnostics: Diagnostic[] = [];
    if (errorDiagnostic && errorDiagnostic.message) {
      const doc = view.state.doc;
      let from = 0;
      let to = Math.min(doc.length, 10);

      if (errorDiagnostic.line && errorDiagnostic.line > 0 && errorDiagnostic.line <= doc.lines) {
        const line = doc.line(errorDiagnostic.line);
        if (errorDiagnostic.column && errorDiagnostic.column > 0) {
          from = Math.min(line.from + errorDiagnostic.column - 1, line.to);
          to = Math.min(from + 5, line.to);
        } else {
          from = line.from;
          to = line.to;
        }
      }

      diagnostics.push({
        from: Math.max(0, from),
        to: Math.max(from + 1, to),
        severity: 'error',
        message: errorDiagnostic.message,
      });
    }
    return diagnostics;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      history(),
      bracketMatching(),
      syntaxHighlighting(darkHighlightStyle),
      oledDarkTheme,
      getLanguageExtension(format),
      customLinter,
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        indentWithTab,
        {
          key: 'Mod-Shift-f',
          run: () => {
            if (onFormatShortcut) {
              onFormatShortcut();
              return true;
            }
            return false;
          },
        },
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange) {
          const docString = update.state.doc.toString();
          if (docString !== valueRef.current) {
            onChange(docString);
          }
        }
      }),
    ];

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true));
      extensions.push(EditorView.editable.of(false));
    }

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [format, readOnly]);

  // Synchronize document changes without recreating editor state
  useEffect(() => {
    const view = viewRef.current;
    if (view && value !== view.state.doc.toString()) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: value || '',
        },
      });
    }
  }, [value]);

  if (!mounted) {
    return (
      <div className={`w-full h-full min-h-[360px] flex-1 overflow-hidden relative bg-oled p-4 text-xs font-mono text-zinc-400 whitespace-pre-wrap select-text ${className}`}>
        {value}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[360px] flex-1 overflow-hidden relative ${className}`}
    />
  );
}
