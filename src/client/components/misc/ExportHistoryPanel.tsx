import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Download, History, TrendingDown, AlertCircle } from 'lucide-react';
import { exportAsCSV, generateReportHTML } from '../../utils/export';
import {
  saveScanToHistory,
  getDomainScanHistory,
  getVulnerabilitySummary,
  getScanTrend,
  deleteScan,
} from '../../utils/scan-history';

const Container = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin: 16px 0;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #4ce1d3 0%, #2aa89a 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(76, 225, 211, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const HistoryPanel = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(76, 225, 211, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid #4ce1d3;
  margin-bottom: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const DiffBadge = styled.span<{ type: 'new' | 'resolved' | 'changed' | 'unchanged' }>`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  background-color: ${(props) => {
    switch (props.type) {
      case 'new':
        return '#ff6b6b';
      case 'resolved':
        return '#51cf66';
      case 'changed':
        return '#ffd93d';
      case 'unchanged':
        return '#a0aec0';
      default:
        return '#a0aec0';
    }
  }};
  color: white;
`;

interface ExportHistoryPanelProps {
  scanData: any;
  apiEndpoint: string;
}

export const ExportHistoryPanel: React.FC<ExportHistoryPanelProps> = ({
  scanData,
  apiEndpoint,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(getDomainScanHistory(scanData.address));
  const [comparison, setComparison] = useState<any>(null);

  const handleExportPDF = () => {
    try {
      const html = generateReportHTML(scanData);
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 100);
      }
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF');
    }
  };

  const handleExportCSV = () => {
    try {
      exportAsCSV(scanData);
    } catch (error) {
      console.error('CSV export error:', error);
      alert('Failed to export CSV');
    }
  };

  const handleSaveToHistory = () => {
    const record = saveScanToHistory(scanData);
    const updated = getDomainScanHistory(scanData.address);
    setHistory(updated);

    // Show comparison if we have previous scan
    if (history.length > 0) {
      const summary = getVulnerabilitySummary(history[0], record);
      setComparison(summary);
    }

    alert('Scan saved to history!');
  };

  const handleViewHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleDeleteScan = (scanId: string) => {
    deleteScan(scanId);
    const updated = getDomainScanHistory(scanData.address);
    setHistory(updated);
  };

  return (
    <>
      <Container>
        <Button onClick={handleExportPDF} title="Export as PDF">
          <Download /> PDF Export
        </Button>
        <Button onClick={handleExportCSV} title="Export as CSV">
          <Download /> CSV Export
        </Button>
        <Button onClick={handleSaveToHistory} title="Save scan to history for tracking">
          <History /> Save to History
        </Button>
        <Button onClick={handleViewHistory} title="View scan history and vulnerability tracking">
          <TrendingDown /> Scan History ({history.length})
        </Button>
      </Container>

      {showHistory && (
        <HistoryPanel>
          <h3 style={{ marginTop: 0, color: '#4ce1d3' }}>
            <AlertCircle style={{ display: 'inline', marginRight: '8px' }} /> Scan History
          </h3>

          {comparison && (
            <div
              style={{
                background: 'rgba(76, 225, 211, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '12px',
                fontSize: '12px',
              }}
            >
              <strong>Latest Comparison:</strong>
              <div>Total Changes: {comparison.new + comparison.resolved + comparison.changed}</div>
              <div style={{ color: '#51cf66' }}>✓ Resolved: {comparison.resolved}</div>
              <div style={{ color: '#ff6b6b' }}>✗ New Issues: {comparison.new}</div>
              <div style={{ color: '#ffd93d' }}>⚠ Changed: {comparison.changed}</div>
            </div>
          )}

          {history.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center' }}>No scan history yet. Save a scan to get started!</p>
          ) : (
            history.map((scan, index) => (
              <HistoryItem key={scan.id}>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(scan.timestamp).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>
                    {scan.vulnerabilityCount} vulnerabilities found
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteScan(scan.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ff6b6b',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Delete
                </button>
              </HistoryItem>
            ))
          )}
        </HistoryPanel>
      )}
    </>
  );
};

export default ExportHistoryPanel;
