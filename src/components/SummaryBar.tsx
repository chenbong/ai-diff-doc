import type { ComparisonResult } from '../types';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface SummaryBarProps {
  result: ComparisonResult;
}

export function SummaryBar({ result }: SummaryBarProps) {
  const { stats, summary } = result;

  return (
    <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-gray-200 px-6 py-4">
      <h2 className="text-base font-bold text-gray-900 mb-2">差异小结</h2>
      <p className="text-sm text-gray-700 mb-3 font-medium">{summary}</p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-medium">
          共 {stats.totalIssues} 个问题
        </span>
        {stats.critical > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
            <AlertTriangle className="w-3.5 h-3.5" />
            {stats.critical} 严重
          </span>
        )}
        {stats.warning > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
            <AlertCircle className="w-3.5 h-3.5" />
            {stats.warning} 警告
          </span>
        )}
        {stats.info > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            <Info className="w-3.5 h-3.5" />
            {stats.info} 提示
          </span>
        )}
      </div>
    </div>
  );
}
