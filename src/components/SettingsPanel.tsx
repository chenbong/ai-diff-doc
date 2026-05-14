import { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle } from 'lucide-react';
import type { ApiConfig } from '../services/ai';

interface SettingsPanelProps {
  config: ApiConfig;
  onSave: (config: ApiConfig) => void;
  onClose: () => void;
}

export function SettingsPanel({ config, onSave, onClose }: SettingsPanelProps) {
  const [apiBase, setApiBase] = useState(config.apiBase || 'https://api.deepseek.com');
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [model, setModel] = useState(config.model || 'deepseek-v4-flash');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const canSave = apiBase.trim() && apiKey.trim() && model.trim();

  const handleSave = () => {
    onSave({ apiBase: apiBase.trim(), apiKey: apiKey.trim(), model: model.trim() });
    setSaved(true);
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">API 配置</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-xs text-gray-500">配置信息仅保存在浏览器本地，不会上传到任何服务器。</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">API 地址</label>
            <input
              type="text"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              placeholder="https://api.openai.com"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
            />
            <p className="text-xs text-gray-400 mt-1">支持 OpenAI 兼容格式，会自动拼接 /v1/chat/completions</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">模型名称</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4o / claude-sonnet-4-6 / deepseek-chat ..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed rounded-lg"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                已保存
              </>
            ) : (
              '保存配置'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
