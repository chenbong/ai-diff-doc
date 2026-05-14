import { useRef, useEffect, useMemo } from 'react';
import type { ComparisonIssue } from '../types';

interface AnnotatedPanelProps {
  label: string;
  content: string;
  issues: ComparisonIssue[];
  side: 'A' | 'B';
  selectedIssueId: string | null;
  scrollTrigger: number;
  accent: string;
}

function findTargetLine(issue: ComparisonIssue, side: 'A' | 'B', lines: string[]): number | null {
  const range = side === 'A' ? issue.documentA : issue.documentB;

  if (range.lineStart != null && range.lineStart >= 1 && range.lineStart <= lines.length) {
    return range.lineStart;
  }

  if (!range.excerpt || range.excerpt.trim().length < 3) return null;

  const excerpt = range.excerpt.trim();

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(excerpt)) {
      return i + 1;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    if (excerpt.includes(lines[i].trim()) && lines[i].trim().length > 5) {
      return i + 1;
    }
  }

  const chunk = excerpt.slice(0, Math.min(20, excerpt.length));
  if (chunk.length >= 4) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(chunk)) {
        return i + 1;
      }
    }
  }

  return null;
}

export function AnnotatedPanel({ label, content, issues, side, selectedIssueId, scrollTrigger, accent }: AnnotatedPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = useMemo(() => content.split('\n'), [content]);

  const lineIssueMap = useMemo(() => {
    const map = new Map<number, ComparisonIssue>();
    for (const issue of issues) {
      const targetLine = findTargetLine(issue, side, lines);
      if (targetLine != null) {
        const range = side === 'A' ? issue.documentA : issue.documentB;
        const end = range.lineEnd ?? targetLine;
        for (let i = targetLine; i <= end; i++) {
          if (!map.has(i)) {
            map.set(i, issue);
          }
        }
      }
    }
    return map;
  }, [issues, side, lines]);

  useEffect(() => {
    if (!selectedIssueId || !containerRef.current) return;
    const issue = issues.find((i) => i.id === selectedIssueId);
    if (!issue) return;

    const targetLine = findTargetLine(issue, side, lines);
    if (targetLine == null) return;

    const el = containerRef.current.querySelector(`[data-line="${targetLine}"]`);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('line-highlight-active');
    void (el as HTMLElement).offsetWidth;
    el.classList.add('line-highlight-active');
    setTimeout(() => el.classList.remove('line-highlight-active'), 3000);
  }, [selectedIssueId, scrollTrigger]);

  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-gray-100 last:border-r-0">
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: accent }} />
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-thin p-0 font-mono text-sm">
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const issue = lineIssueMap.get(lineNum);
          let highlightClass = '';
          if (issue) {
            if (issue.severity === 'critical') highlightClass = 'line-highlight-critical';
            else if (issue.severity === 'warning') highlightClass = 'line-highlight-warning';
            else highlightClass = 'line-highlight-info';
          }

          return (
            <div
              key={lineNum}
              data-line={lineNum}
              className={`flex px-4 py-0.5 leading-6 ${highlightClass} ${
                issue && issue.id === selectedIssueId ? 'line-highlight-active' : ''
              }`}
            >
              <span className="w-8 shrink-0 text-right pr-3 text-gray-400 select-none text-xs leading-6">
                {lineNum}
              </span>
              <span className="whitespace-pre-wrap break-all">{line || ' '}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
