import type { ComparisonIssue } from '../types';
import { IssueCard } from './IssueCard';
import { ListChecks } from 'lucide-react';

interface IssueSidebarProps {
  issues: ComparisonIssue[];
  selectedIssueId: string | null;
  onSelectIssue: (id: string | null) => void;
}

export function IssueSidebar({ issues, selectedIssueId, onSelectIssue }: IssueSidebarProps) {
  return (
    <div className="w-80 shrink-0 border-l border-gray-100 bg-gradient-to-b from-gray-50 to-slate-50 flex flex-col">
      <div className="px-4 py-3.5 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-gray-800">问题列表</h3>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 ml-6">共发现 {issues.length} 个问题，点击定位原文</p>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2.5">
        {issues.map((issue, idx) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            index={idx + 1}
            isSelected={selectedIssueId === issue.id}
            onClick={() => onSelectIssue(issue.id)}
          />
        ))}
      </div>
    </div>
  );
}
