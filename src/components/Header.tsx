import { Search, RotateCcw, Settings } from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  onSettings?: () => void;
  isConfigured?: boolean;
}

export function Header({ showBack, onBack, onSettings, isConfigured }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-400 rounded-xl flex items-center justify-center shadow-md shadow-red-500/20">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">双文档找茬器 - 第1组[一度]小组作品</h1>
          <p className="text-xs text-slate-400">AI 驱动的双文档差异分析工具</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4" />
            返回编辑
          </button>
        )}
        <button
          onClick={onSettings}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors backdrop-blur-sm border ${
            isConfigured
              ? 'text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border-white/10'
              : 'text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30'
          }`}
        >
          <Settings className="w-4 h-4" />
          {isConfigured ? 'API 设置' : '请先配置 API'}
        </button>
      </div>
    </header>
  );
}
