import { useMemo, useRef, useEffect } from 'react';
import { Loader2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface LoadingOverlayProps {
  streamText: string;
}

interface PartialIssue {
  title: string;
  type: string;
  severity: string;
}

function extractPartialIssues(text: string): PartialIssue[] {
  const issues: PartialIssue[] = [];
  const titleMatches = [...text.matchAll(/"title"\s*:\s*"([^"]+)"/g)];

  for (const titleMatch of titleMatches) {
    const pos = titleMatch.index!;
    const blockStart = text.lastIndexOf('{', pos);
    const blockEnd = text.indexOf('}', pos + titleMatch[0].length);
    if (blockStart === -1) continue;
    const block = text.slice(blockStart, blockEnd === -1 ? pos + 200 : blockEnd + 1);

    const typeMatch = block.match(/"type"\s*:\s*"([^"]+)"/);
    const severityMatch = block.match(/"severity"\s*:\s*"([^"]+)"/);

    if (typeMatch) {
      issues.push({
        title: titleMatch[1],
        type: typeMatch[1],
        severity: severityMatch?.[1] || 'warning',
      });
    }
  }

  return issues;
}

const SeverityIcon = ({ severity }: { severity: string }) => {
  if (severity === 'critical') return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
  if (severity === 'warning') return <AlertCircle className="w-3.5 h-3.5 text-amber-500" />;
  return <Info className="w-3.5 h-3.5 text-blue-500" />;
};

export function LoadingOverlay({ streamText }: LoadingOverlayProps) {
  const issues = useMemo(() => extractPartialIssues(streamText), [streamText]);
  const issueCount = issues.length;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [issues.length]);

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-slate-50/90 to-white/90 backdrop-blur-md z-20 flex items-center justify-center">
      <div className="flex flex-col items-center max-w-md w-full px-6">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin drop-shadow-md" />
        <p className="text-lg font-bold text-gray-800 mt-4">AI 正在分析文档...</p>
        <p className="text-sm text-gray-500 mt-1">正在逐行对比，寻找差异</p>

        {issueCount > 0 && (
          <div className="mt-5 w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-gray-600">已发现 {issueCount} 个问题</span>
            </div>
            <div className="relative h-48 overflow-hidden rounded-lg border border-gray-200/60 bg-gray-900/95 shadow-xl">
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.8)_0%,transparent_20%,transparent_80%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />
              <div ref={scrollRef} className="p-3 space-y-2 overflow-y-auto h-full scrollbar-thin">
                {issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 px-3 py-2 rounded-md bg-white/5 border border-white/10 animate-fade-in"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <span className="text-xs font-mono text-cyan-400 shrink-0 w-5 text-right">#{idx + 1}</span>
                    <SeverityIcon severity={issue.severity} />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-mono text-green-400 opacity-70">[{issue.type}]</span>
                      <p className="text-sm text-gray-200 truncate">{issue.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {issueCount === 0 && streamText.length > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 border border-gray-200 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-600">正在接收 AI 响应...</span>
          </div>
        )}
      </div>
    </div>
  );
}
