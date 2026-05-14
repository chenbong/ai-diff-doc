export type IssueType = 'CONTRADICTION' | 'OMISSION' | 'INCONSISTENCY' | 'AMBIGUITY';
export type Severity = 'critical' | 'warning' | 'info';

export interface DocumentRange {
  lineStart: number | null;
  lineEnd: number | null;
  excerpt: string;
}

export interface ComparisonIssue {
  id: string;
  type: IssueType;
  severity: Severity;
  title: string;
  description: string;
  documentA: DocumentRange;
  documentB: DocumentRange;
  suggestion: string;
}

export interface ComparisonResult {
  summary: string;
  issues: ComparisonIssue[];
  stats: { totalIssues: number; critical: number; warning: number; info: number };
}

export type AppView = 'editor' | 'result';
