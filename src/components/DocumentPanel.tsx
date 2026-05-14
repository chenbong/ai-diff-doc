import { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

interface DocumentPanelProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accent: string;
}

export function DocumentPanel({ label, value, onChange, accent }: DocumentPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  const lineCount = value ? value.split('\n').length : 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" style={{ color: accent }} />
          <span className="text-sm font-semibold text-gray-700">{label}</span>
          {lineCount > 0 && (
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{lineCount} 行</span>
          )}
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-md hover:shadow-sm"
        >
          <Upload className="w-3.5 h-3.5" />
          上传文件
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.md,.text"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      <div className="flex-1 relative min-h-0">
        {!value && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-gray-400 pointer-events-none z-10">
            <FileText className="w-12 h-12 mb-3 opacity-30" style={{ color: accent }} />
            <p className="text-sm">在此粘贴或输入文档内容</p>
            <p className="text-xs mt-1">支持 .txt / .md 文件上传</p>
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full p-4 resize-none text-sm leading-relaxed text-gray-800 focus:outline-none font-mono bg-white"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
