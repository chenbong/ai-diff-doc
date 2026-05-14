import type { ComparisonResult, ComparisonIssue } from '../types';

export function parseComparisonResult(raw: string): ComparisonResult {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('未能从 AI 响应中提取 JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  const issues: ComparisonIssue[] = (parsed.issues || []).map(
    (issue: Record<string, unknown>, idx: number) => ({
      id: (issue.id as string) || `issue-${idx + 1}`,
      type: issue.type || 'INCONSISTENCY',
      severity: issue.severity || 'warning',
      title: issue.title || '未命名问题',
      description: issue.description || '',
      documentA: {
        lineStart: (issue.documentA as Record<string, unknown>)?.lineStart ?? null,
        lineEnd: (issue.documentA as Record<string, unknown>)?.lineEnd ?? null,
        excerpt: (issue.documentA as Record<string, unknown>)?.excerpt ?? '',
      },
      documentB: {
        lineStart: (issue.documentB as Record<string, unknown>)?.lineStart ?? null,
        lineEnd: (issue.documentB as Record<string, unknown>)?.lineEnd ?? null,
        excerpt: (issue.documentB as Record<string, unknown>)?.excerpt ?? '',
      },
      suggestion: issue.suggestion || '',
    }),
  );

  const critical = issues.filter((i) => i.severity === 'critical').length;
  const warning = issues.filter((i) => i.severity === 'warning').length;
  const info = issues.filter((i) => i.severity === 'info').length;

  return {
    summary: (parsed.summary as string) || '',
    issues,
    stats: {
      totalIssues: issues.length,
      critical,
      warning,
      info,
    },
  };
}

export function fixLineNumbers(
  issues: ComparisonIssue[],
  docA: string,
  docB: string,
): ComparisonIssue[] {
  const linesA = docA.split('\n');
  const linesB = docB.split('\n');

  return issues.map((issue) => ({
    ...issue,
    documentA: fixRange(issue.documentA, linesA),
    documentB: fixRange(issue.documentB, linesB),
  }));
}

function fixRange(
  range: ComparisonIssue['documentA'],
  lines: string[],
): ComparisonIssue['documentA'] {
  if (range.lineStart != null && range.lineStart >= 1 && range.lineStart <= lines.length) {
    return range;
  }

  if (!range.excerpt || range.excerpt.trim().length < 6) return range;

  const excerpt = range.excerpt.trim();

  for (let i = 0; i < lines.length; i++) {
    const lineTrimmed = lines[i].trim();
    if (lineTrimmed.length < 3) continue;
    if (lines[i].includes(excerpt) || excerpt.includes(lineTrimmed)) {
      return { ...range, lineStart: i + 1, lineEnd: i + 1 };
    }
  }

  const chunk = excerpt.slice(0, Math.min(25, excerpt.length));
  if (chunk.length >= 6) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().length < 3) continue;
      if (lines[i].includes(chunk)) {
        return { ...range, lineStart: i + 1, lineEnd: i + 1 };
      }
    }
  }

  return range;
}
