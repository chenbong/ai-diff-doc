import type { ComparisonIssue } from '../types';
import { SEVERITY_COLORS, ISSUE_TYPE_LABELS } from '../constants';
import { AlertTriangle, AlertCircle, Info, Lightbulb } from 'lucide-react';

interface IssueCardProps {
  issue: ComparisonIssue;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const SeverityIcon = ({ severity }: { severity: string }) => {
  if (severity === 'critical') return <AlertTriangle className="w-4 h-4" />;
  if (severity === 'warning') return <AlertCircle className="w-4 h-4" />;
  return <Info className="w-4 h-4" />;
};

export function IssueCard({ issue, index, isSelected, onClick }: IssueCardProps) {
  const colors = SEVERITY_COLORS[issue.severity];

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-xl border-l-4 cursor-pointer transition-all bg-white ${colors.border} ${
        isSelected ? 'ring-2 ring-offset-1 ring-slate-400 shadow-lg scale-[1.02]' : 'shadow-sm hover:shadow-md hover:scale-[1.01]'
      }`}
    >
      <div className="flex items-start gap-1.5">
        <span className="text-xs font-bold text-slate-400 mt-0.5 shrink-0">#{index}</span>
        <span className={`${colors.text} mt-0.5 shrink-0`}>
          <SeverityIcon severity={issue.severity} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.text} ${colors.bg} border ${colors.border}`}>
              {ISSUE_TYPE_LABELS[issue.type] || issue.type}
            </span>
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">{issue.title}</h4>
          <p className="text-xs text-gray-600 leading-relaxed">{issue.description}</p>
          {issue.suggestion && (
            <div className="mt-2.5 flex items-start gap-1.5 text-xs text-gray-500 bg-amber-50/50 rounded-lg p-2 border border-amber-100/50">
              <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
              <span>{issue.suggestion}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
