/**
 * Export utilities for PDF and CSV downloads
 */

export const exportScan = (format: string, scanData: any) => {
  try {
    if (format === 'pdf') {
      exportAsPDF(scanData);
    } else if (format === 'csv') {
      exportAsCSV(scanData);
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    console.error('Export error:', error);
    throw new Error(`Failed to export as ${format.toUpperCase()}`);
  }
};

/**
 * Generate PDF client-side using browser print functionality
 */
export const exportAsPDF = (scanData: any) => {
  const printWindow = window.open('', '', 'height=600,width=800');
  if (printWindow) {
    printWindow.document.write(generateReportHTML(scanData));
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};

/**
 * Fallback: Generate PDF using browser print functionality
 */
export const exportAsHTMLPDF = (scanData: any) => {
  const printWindow = window.open('', '', 'height=600,width=800');
  if (printWindow) {
    printWindow.document.write(generateReportHTML(scanData));
    printWindow.document.close();
    printWindow.print();
  }
};

/**
 * Generate comprehensive HTML report content
 */
export const generateReportHTML = (scanData: any) => {
  const timestamp = new Date().toLocaleString();
  const address = scanData.address || 'Unknown URL';
  const scanId = scanData.id || 'N/A';
  
  const resultsHTML = scanData.results
    ?.map(
      (result: any) => `
    <div class="result-item ${result.severity || 'info'}">
      <div class="result-header">
        <h3>${result.title || 'Unknown'}</h3>
        <span class="result-status ${result.status || 'completed'}">${result.status || 'Completed'}</span>
      </div>
      <p class="result-category"><strong>Category:</strong> ${result.tags?.join(', ') || 'N/A'}</p>
      ${result.severity ? `<p class="result-severity"><strong>Severity:</strong> ${result.severity}</p>` : ''}
      ${result.description ? `<p class="result-description">${result.description}</p>` : ''}
      ${result.data ? `<pre class="result-data">${JSON.stringify(result.data, null, 2)}</pre>` : ''}
    </div>
  `,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Web Check Report - ${address}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333;
          background: #fafafa;
        }
        .container { max-width: 900px; margin: 0 auto; background: white; }
        .header { 
          background: linear-gradient(135deg, #4ce1d3 0%, #116466 100%); 
          color: white; 
          padding: 40px 30px;
          border-bottom: 3px solid #4ce1d3;
        }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { font-size: 14px; opacity: 0.95; }
        .metadata { 
          background: #f8f9fa; 
          padding: 20px 30px; 
          border-bottom: 1px solid #e0e0e0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .metadata-item { padding: 10px 0; }
        .metadata-item strong { color: #4ce1d3; display: block; font-size: 12px; text-transform: uppercase; }
        .metadata-item span { font-size: 14px; color: #333; }
        .content { padding: 30px; }
        .section-title { 
          font-size: 20px; 
          color: #116466; 
          margin: 30px 0 20px 0; 
          padding-bottom: 10px;
          border-bottom: 2px solid #4ce1d3;
        }
        .result-item { 
          margin: 15px 0; 
          padding: 15px; 
          border-left: 4px solid #4ce1d3; 
          background: #f9f9f9;
          border-radius: 4px;
        }
        .result-item.warning { border-left-color: #ff9800; }
        .result-item.critical { border-left-color: #f44336; }
        .result-item.success { border-left-color: #4caf50; }
        .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .result-header h3 { font-size: 16px; color: #116466; margin: 0; }
        .result-status { 
          font-size: 12px; 
          padding: 4px 8px; 
          border-radius: 3px; 
          background: #e0f2f1; 
          color: #116466;
          text-transform: capitalize;
        }
        .result-category { font-size: 13px; color: #666; margin: 8px 0; }
        .result-severity { font-size: 13px; color: #d32f2f; font-weight: bold; margin: 8px 0; }
        .result-description { font-size: 14px; color: #555; margin: 10px 0; }
        .result-data { 
          background: white; 
          padding: 12px; 
          border: 1px solid #ddd; 
          border-radius: 4px;
          overflow-x: auto;
          font-size: 12px;
          margin-top: 10px;
        }
        .footer { 
          margin-top: 40px; 
          padding: 20px 30px; 
          font-size: 12px; 
          color: #999; 
          border-top: 1px solid #e0e0e0; 
          text-align: center;
        }
        .summary-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        .stat-box {
          background: #f0f0f0;
          padding: 15px;
          border-radius: 4px;
          text-align: center;
        }
        .stat-number { font-size: 24px; font-weight: bold; color: #4ce1d3; }
        .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔍 Web Security Report</h1>
          <p>Comprehensive website analysis and security assessment</p>
        </div>
        
        <div class="metadata">
          <div class="metadata-item">
            <strong>Target URL</strong>
            <span>${address}</span>
          </div>
          <div class="metadata-item">
            <strong>Scan Date & Time</strong>
            <span>${timestamp}</span>
          </div>
          <div class="metadata-item">
            <strong>Scan ID</strong>
            <span>${scanId}</span>
          </div>
          <div class="metadata-item">
            <strong>Report Generated</strong>
            <span>Web-Check Platform</span>
          </div>
        </div>

        <div class="content">
          <div class="section-title">📊 Scan Results</div>
          ${resultsHTML || '<p>No results available for this scan.</p>'}
        </div>

        <div class="footer">
          <p>🛡️ This report was generated by <strong>Web-Check</strong> — Website Intelligence & Security Analysis Platform</p>
          <p>For more information, visit: <strong>https://web-check.xyz</strong></p>
          <p style="margin-top: 15px; color: #bbb;">Report ID: ${scanId} | Generated: ${timestamp}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Export as CSV
 */
export const exportAsCSV = (scanData: any) => {
  const address = scanData.address || 'unknown';
  const timestamp = new Date().toISOString();
  
  // Build header row
  const headers = ['Timestamp', 'URL', 'Check Name', 'Category', 'Severity', 'Status', 'Description', 'Data'];
  
  // Build data rows
  const rows = (scanData.results || []).map((result: any) => [
    timestamp,
    address,
    result.title || 'Unknown',
    result.tags?.join('; ') || 'N/A',
    result.severity || 'info',
    result.status || 'completed',
    result.description || '',
    JSON.stringify(result.data || {}),
  ]);

  // Convert to CSV format with proper escaping
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map((row: any[]) => 
      row.map((cell: any) => {
        const cellStr = String(cell || '').replace(/"/g, '""');
        return `"${cellStr}"`;
      }).join(',')
    ),
  ].join('\n');

  // Create and download blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `web-check-report-${address}-${new Date().getTime()}.csv`;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
