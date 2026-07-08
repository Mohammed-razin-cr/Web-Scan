/**
 * Scan History and Vulnerability Tracking
 * Stores scan results and tracks changes over time
 */

const STORAGE_KEY = 'webscan-history';
const MAX_SCANS = 50; // Keep last 50 scans

export interface ScanRecord {
  id: string;
  address: string;
  timestamp: number;
  results: any[];
  vulnerabilityCount: number;
  issuesSummary: Record<string, number>;
}

export interface VulnerabilityDiff {
  id: string;
  title: string;
  previousStatus?: string;
  currentStatus: string;
  changeType: 'new' | 'resolved' | 'changed' | 'unchanged';
  severity?: string;
}

/**
 * Save a scan to history
 */
export const saveScanToHistory = (scanData: any): ScanRecord => {
  const history = getScanHistory();

  const record: ScanRecord = {
    id: generateScanId(),
    address: scanData.address,
    timestamp: Date.now(),
    results: scanData.results || [],
    vulnerabilityCount: countVulnerabilities(scanData.results),
    issuesSummary: summarizeIssues(scanData.results),
  };

  history.unshift(record);

  // Keep only the most recent scans
  if (history.length > MAX_SCANS) {
    history.pop();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return record;
};

/**
 * Get all scan history
 */
export const getScanHistory = (): ScanRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading scan history:', error);
    return [];
  }
};

/**
 * Get scan history for a specific domain
 */
export const getDomainScanHistory = (address: string): ScanRecord[] => {
  const history = getScanHistory();
  return history.filter((scan) => scan.address.toLowerCase() === address.toLowerCase());
};

/**
 * Compare two scans and detect vulnerability changes
 */
export const compareScans = (
  previousScan: ScanRecord | null,
  currentScan: ScanRecord,
): VulnerabilityDiff[] => {
  const diffs: VulnerabilityDiff[] = [];

  if (!previousScan) {
    // First scan - mark all as new
    currentScan.results.forEach((result) => {
      diffs.push({
        id: result.id,
        title: result.title,
        currentStatus: result.status || 'completed',
        changeType: 'new',
        severity: getSeverity(result),
      });
    });
    return diffs;
  }

  // Create a map of previous results for quick lookup
  const prevMap = new Map(previousScan.results.map((r) => [r.id, r]));

  // Check current results against previous
  currentScan.results.forEach((current) => {
    const prev = prevMap.get(current.id);

    if (!prev) {
      // New check result
      diffs.push({
        id: current.id,
        title: current.title,
        currentStatus: current.status || 'completed',
        changeType: 'new',
        severity: getSeverity(current),
      });
    } else if (prev.status !== current.status) {
      // Status changed
      diffs.push({
        id: current.id,
        title: current.title,
        previousStatus: prev.status,
        currentStatus: current.status,
        changeType: isVulnerabilityResolved(prev, current) ? 'resolved' : 'changed',
        severity: getSeverity(current),
      });
    } else {
      // No change
      diffs.push({
        id: current.id,
        title: current.title,
        currentStatus: current.status || 'completed',
        changeType: 'unchanged',
        severity: getSeverity(current),
      });
    }
  });

  return diffs;
};

/**
 * Get vulnerability summary comparing current to previous scan
 */
export const getVulnerabilitySummary = (
  previousScan: ScanRecord | null,
  currentScan: ScanRecord,
) => {
  const diffs = compareScans(previousScan, currentScan);

  return {
    total: diffs.length,
    new: diffs.filter((d) => d.changeType === 'new').length,
    resolved: diffs.filter((d) => d.changeType === 'resolved').length,
    changed: diffs.filter((d) => d.changeType === 'changed').length,
    unchanged: diffs.filter((d) => d.changeType === 'unchanged').length,
    criticalIssues: diffs.filter((d) => d.severity === 'critical').length,
    highIssues: diffs.filter((d) => d.severity === 'high').length,
    improvements: diffs.filter((d) => d.changeType === 'resolved').length,
  };
};

/**
 * Get trend data for a domain (vulnerability count over time)
 */
export const getScanTrend = (address: string) => {
  const scans = getDomainScanHistory(address);
  return scans.map((scan) => ({
    date: new Date(scan.timestamp).toLocaleDateString(),
    timestamp: scan.timestamp,
    vulnerabilities: scan.vulnerabilityCount,
    issueCount: Object.values(scan.issuesSummary).reduce((a, b) => a + (b as number), 0),
  }));
};

/**
 * Clear scan history
 */
export const clearScanHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Delete specific scan from history
 */
export const deleteScan = (scanId: string) => {
  const history = getScanHistory();
  const filtered = history.filter((scan) => scan.id !== scanId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Helper functions

function generateScanId(): string {
  return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function countVulnerabilities(results: any[]): number {
  if (!results) return 0;
  return results.filter(
    (r) =>
      r.status === 'vulnerable' || r.status === 'warning' || r.status === 'error' || r.severity,
  ).length;
}

function summarizeIssues(results: any[]): Record<string, number> {
  const summary: Record<string, number> = {};
  if (!results) return summary;

  results.forEach((result) => {
    const category = result.tags?.[0] || 'other';
    summary[category] = (summary[category] || 0) + 1;
  });

  return summary;
}

function getSeverity(result: any): string {
  if (result.severity) return result.severity.toLowerCase();
  if (result.status === 'vulnerable') return 'critical';
  if (result.status === 'warning') return 'high';
  if (result.status === 'error') return 'medium';
  return 'info';
}

function isVulnerabilityResolved(prev: any, current: any): boolean {
  const prevIsVuln = prev.status === 'vulnerable' || prev.status === 'warning';
  const currIsVuln = current.status === 'vulnerable' || current.status === 'warning';
  return prevIsVuln && !currIsVuln;
}
