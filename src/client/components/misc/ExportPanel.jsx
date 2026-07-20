import styled from '@emotion/styled';
import { memo } from 'react';
import colors from 'client/styles/colors';
import { toast } from 'react-toastify';

const ExportPanelContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: min(1400px, calc(100% - clamp(1rem, 4vw, 2rem)));
  padding: 1.25rem;
  background: rgba(76, 225, 211, 0.03);
  border-radius: 8px;
  margin: 0 auto;

  @media (max-width: 520px) {
    align-items: stretch;
    padding: 0.85rem;
  }
`;

const ExportButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 520px) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, rgba(76, 225, 211, 0.12), rgba(76, 225, 211, 0.05));
  border: 1px solid rgba(76, 225, 211, 0.25);
  border-radius: 6px;
  color: #4ce1d3;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;

  &:hover {
    background: linear-gradient(135deg, rgba(76, 225, 211, 0.2), rgba(76, 225, 211, 0.12));
    border-color: rgba(76, 225, 211, 0.45);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(76, 225, 211, 0.15);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }

  @media (max-width: 520px) {
    justify-content: center;
    min-width: 0;
    padding: 0.58rem 0.3rem;
    font-size: 0.76rem;
  }
`;

const Label = styled.span`
  font-size: 0.85rem;
  color: ${colors.textColorSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-right: 0.25rem;

  @media (max-width: 520px) {
    width: 100%;
    margin-right: 0;
    text-align: center;
  }
`;

export const ExportPanel = memo(({ onExportPDF, onExportCSV, onExportHistory, isLoading = false }) => {
  const handleExport = (handler, format) => {
    try {
      handler();
      toast.success(`✓ ${format} exported successfully!`);
    } catch (error) {
      console.error(`Export error:`, error);
      toast.error(`Failed to export ${format}`);
    }
  };

  return (
    <ExportPanelContainer>
      <Label>📥 Export Report:</Label>
      <ExportButtonGroup>
        <ExportButton
          onClick={() => handleExport(onExportPDF, 'PDF')}
          disabled={isLoading}
          title="Download detailed PDF report with all security findings"
        >
          📄 PDF
        </ExportButton>
        <ExportButton
          onClick={() => handleExport(onExportCSV, 'CSV')}
          disabled={isLoading}
          title="Download CSV file for spreadsheet analysis"
        >
          📊 CSV
        </ExportButton>
        <ExportButton
          onClick={() => handleExport(onExportHistory, 'History')}
          disabled={isLoading}
          title="Download complete scan history as JSON"
        >
          📈 History
        </ExportButton>
      </ExportButtonGroup>
    </ExportPanelContainer>
  );
});

ExportPanel.displayName = 'ExportPanel';
export default ExportPanel;
