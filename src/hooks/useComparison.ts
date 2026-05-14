import { useState, useRef, useCallback } from 'react';
import type { ComparisonResult, AppView } from '../types';
import { streamChatCompletion } from '../services/ai';
import type { ApiConfig } from '../services/ai';
import { buildSystemPrompt, buildUserPrompt } from '../services/prompt';
import { parseComparisonResult, fixLineNumbers } from '../services/parser';

const STORAGE_KEY = 'zhaocha_api_config';

function loadConfig(): ApiConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { apiBase: '', apiKey: '', model: '' };
}

function saveConfig(config: ApiConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

interface UseComparisonReturn {
  view: AppView;
  docA: string;
  docB: string;
  setDocA: (v: string) => void;
  setDocB: (v: string) => void;
  result: ComparisonResult | null;
  isLoading: boolean;
  error: string | null;
  streamText: string;
  startComparison: () => void;
  resetToEditor: () => void;
  selectedIssueId: string | null;
  selectIssue: (id: string | null) => void;
  scrollTrigger: number;
  apiConfig: ApiConfig;
  setApiConfig: (config: ApiConfig) => void;
  isConfigured: boolean;
}

export function useComparison(): UseComparisonReturn {
  const [view, setView] = useState<AppView>('editor');
  const [docA, setDocA] = useState('');
  const [docB, setDocB] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamText, setStreamText] = useState('');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const [apiConfig, setApiConfigState] = useState<ApiConfig>(loadConfig);
  const abortRef = useRef<AbortController | null>(null);

  const isConfigured = !!(apiConfig.apiBase && apiConfig.apiKey && apiConfig.model);

  const setApiConfig = useCallback((config: ApiConfig) => {
    setApiConfigState(config);
    saveConfig(config);
  }, []);

  const selectIssue = useCallback((id: string | null) => {
    setSelectedIssueId(id);
    if (id) setScrollTrigger((n) => n + 1);
  }, []);

  const startComparison = useCallback(async () => {
    if (!docA.trim() || !docB.trim()) {
      setError('请在两侧都输入文档内容');
      return;
    }
    if (!isConfigured) {
      setError('请先配置 API 信息（点击右上角设置按钮）');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStreamText('');
    setResult(null);
    setSelectedIssueId(null);

    abortRef.current = new AbortController();

    try {
      const systemPrompt = buildSystemPrompt();
      const userPrompt = buildUserPrompt(docA, docB);

      const fullText = await streamChatCompletion(
        apiConfig,
        systemPrompt,
        userPrompt,
        (chunk) => setStreamText((prev) => prev + chunk),
        abortRef.current.signal,
      );

      let parsed = parseComparisonResult(fullText);
      parsed = {
        ...parsed,
        issues: fixLineNumbers(parsed.issues, docA, docB),
      };
      setResult(parsed);
      setView('result');
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || 'AI 分析失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  }, [docA, docB, apiConfig, isConfigured]);

  const resetToEditor = useCallback(() => {
    abortRef.current?.abort();
    setView('editor');
    setResult(null);
    setError(null);
    setStreamText('');
    setSelectedIssueId(null);
  }, []);

  return {
    view,
    docA,
    docB,
    setDocA,
    setDocB,
    result,
    isLoading,
    error,
    streamText,
    startComparison,
    resetToEditor,
    selectedIssueId,
    selectIssue,
    scrollTrigger,
    apiConfig,
    setApiConfig,
    isConfigured,
  };
}
