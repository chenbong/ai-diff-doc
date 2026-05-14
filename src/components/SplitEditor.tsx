import { DocumentPanel } from './DocumentPanel';
import { Zap, BookOpen, Trash2 } from 'lucide-react';
import { SAMPLE_DOC_A, SAMPLE_DOC_B } from '../constants';

interface SplitEditorProps {
  docA: string;
  docB: string;
  onDocAChange: (v: string) => void;
  onDocBChange: (v: string) => void;
  onCompare: () => void;
  isLoading: boolean;
}

export function SplitEditor({
  docA,
  docB,
  onDocAChange,
  onDocBChange,
  onCompare,
  isLoading,
}: SplitEditorProps) {
  const canCompare = docA.trim().length > 0 && docB.trim().length > 0 && !isLoading;

  const loadSample = () => {
    onDocAChange(SAMPLE_DOC_A);
    onDocBChange(SAMPLE_DOC_B);
  };

  const hasContent = docA.trim().length > 0 || docB.trim().length > 0;

  const clearAll = () => {
    onDocAChange('');
    onDocBChange('');
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-4">
      <div className="flex-1 flex gap-4 min-h-0">
        <DocumentPanel label="文档 A" value={docA} onChange={onDocAChange} accent="#3b82f6" />
        <DocumentPanel label="文档 B" value={docB} onChange={onDocBChange} accent="#8b5cf6" />
      </div>
      <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={loadSample}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg hover:shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            加载示例
          </button>
          {hasContent && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
              清空内容
            </button>
          )}
        </div>
        <button
          onClick={onCompare}
          disabled={!canCompare}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap className="w-4 h-4" />
          {isLoading ? '分析中...' : '开始找茬'}
        </button>
      </div>
    </div>
  );
}
