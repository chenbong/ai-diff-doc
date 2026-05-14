import type { ComparisonResult } from '../types';
import { SummaryBar } from './SummaryBar';
import { AnnotatedPanel } from './AnnotatedPanel';
import { IssueSidebar } from './IssueSidebar';

interface ComparisonViewProps {
  docA: string;
  docB: string;
  result: ComparisonResult;
  selectedIssueId: string | null;
  onSelectIssue: (id: string | null) => void;
  scrollTrigger: number;
}

export function ComparisonView({ docA, docB, result, selectedIssueId, onSelectIssue, scrollTrigger }: ComparisonViewProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <SummaryBar result={result} />
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex min-w-0">
          <AnnotatedPanel
            label="文档 A"
            content={docA}
            issues={result.issues}
            side="A"
            selectedIssueId={selectedIssueId}
            scrollTrigger={scrollTrigger}
            accent="#3b82f6"
          />
          <AnnotatedPanel
            label="文档 B"
            content={docB}
            issues={result.issues}
            side="B"
            selectedIssueId={selectedIssueId}
            scrollTrigger={scrollTrigger}
            accent="#8b5cf6"
          />
        </div>
        <IssueSidebar
          issues={result.issues}
          selectedIssueId={selectedIssueId}
          onSelectIssue={onSelectIssue}
        />
      </div>
    </div>
  );
}
