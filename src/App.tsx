import { useState } from 'react';
import { Header } from './components/Header';
import { SplitEditor } from './components/SplitEditor';
import { ComparisonView } from './components/ComparisonView';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SettingsPanel } from './components/SettingsPanel';
import { useComparison } from './hooks/useComparison';
import { AlertCircle } from 'lucide-react';

function App() {
  const {
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
  } = useComparison();

  const [showSettings, setShowSettings] = useState(!isConfigured);

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      <Header
        showBack={view === 'result'}
        onBack={resetToEditor}
        onSettings={() => setShowSettings(true)}
        isConfigured={isConfigured}
      />

      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {view === 'editor' && (
        <SplitEditor
          docA={docA}
          docB={docB}
          onDocAChange={setDocA}
          onDocBChange={setDocB}
          onCompare={startComparison}
          isLoading={isLoading}
        />
      )}

      {view === 'result' && result && (
        <ComparisonView
          docA={docA}
          docB={docB}
          result={result}
          selectedIssueId={selectedIssueId}
          onSelectIssue={selectIssue}
          scrollTrigger={scrollTrigger}
        />
      )}

      {isLoading && <LoadingOverlay streamText={streamText} />}

      {showSettings && (
        <SettingsPanel
          config={apiConfig}
          onSave={setApiConfig}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
