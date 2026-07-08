import PDFDocument from 'pdfkit';
import { stringify } from 'csv-stringify/sync';

/**
 * Export scan results as PDF or CSV
 * GET /api/export?format=pdf|csv&data={scanData}
 */
export default async (request, response) => {
  try {
    const { format, data } = request.query;

    if (!data) {
      return response.status(400).json({ error: 'Missing scan data' });
    }

    let scanData;
    try {
      scanData = JSON.parse(decodeURIComponent(data));
    } catch (e) {
      return response.status(400).json({ error: 'Invalid scan data format' });
    }

    if (format === 'pdf') {
      return generatePDF(scanData, response);
    } else if (format === 'csv') {
      return generateCSV(scanData, response);
    } else {
      return response.status(400).json({ error: 'Invalid format. Use pdf or csv' });
    }
  } catch (error) {
    console.error('Export error:', error);
    response.status(500).json({ error: 'Export failed' });
  }
};

/**
 * Generate PDF report from scan results
 */
function generatePDF(scanData, response) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Set response headers
  response.setHeader('Content-Type', 'application/pdf');
  response.setHeader(
    'Content-Disposition',
    `attachment; filename="webscan-report-${scanData.address || 'report'}-${new Date().getTime()}.pdf"`,
  );

  // Pipe to response
  doc.pipe(response);

  // Title
  doc.fontSize(24).font('Helvetica-Bold').text('WebScan Report', { align: 'center' });
  doc.fontSize(12).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, {
    align: 'center',
  });
  doc.moveTo(50, 100).lineTo(550, 100).stroke();
  doc.moveDown();

  // Target info
  doc.fontSize(14).font('Helvetica-Bold').text('Target Information');
  doc.fontSize(11).font('Helvetica');
  doc.text(`URL: ${scanData.address || 'N/A'}`);
  doc.text(`Scan ID: ${scanData.id || 'N/A'}`);
  doc.moveDown();

  // Results by category
  const categories = {};
  if (scanData.results) {
    scanData.results.forEach((result) => {
      const category = result.tags?.[0] || 'Other';
      if (!categories[category]) categories[category] = [];
      categories[category].push(result);
    });
  }

  for (const [category, results] of Object.entries(categories)) {
    doc.fontSize(13).font('Helvetica-Bold').text(category.toUpperCase());
    results.forEach((result) => {
      doc.fontSize(10).font('Helvetica');
      doc.text(`• ${result.title || 'Unknown'}`);
      if (result.data) {
        const summary = getSummary(result.data);
        if (summary) {
          doc.fontSize(9).font('Helvetica-Oblique').text(`  ${summary}`);
        }
      }
    });
    doc.moveDown();
  }

  // Footer
  doc.fontSize(9).text('Powered by WebScan - Website Intelligence & Security Analysis Platform', {
    align: 'center',
    color: '#888888',
  });

  doc.end();
}

/**
 * Generate CSV report from scan results
 */
function generateCSV(scanData, response) {
  const records = [];

  // Header with scan metadata
  records.push({
    'Report Type': 'WebScan Security Analysis',
    'Target URL': scanData.address || 'N/A',
    'Scan Date': new Date().toISOString(),
    'Scan ID': scanData.id || 'N/A',
  });

  records.push({});

  // Results
  if (scanData.results) {
    scanData.results.forEach((result) => {
      records.push({
        Category: result.tags?.join(', ') || 'N/A',
        Check: result.title || 'Unknown',
        Status: result.status || 'Completed',
        Data: JSON.stringify(result.data || {}),
      });
    });
  }

  // Generate CSV
  const csv = stringify(records, { header: true });

  // Set response headers
  response.setHeader('Content-Type', 'text/csv');
  response.setHeader(
    'Content-Disposition',
    `attachment; filename="webscan-report-${scanData.address || 'report'}-${new Date().getTime()}.csv"`,
  );

  response.send(csv);
}

/**
 * Get a readable summary of result data
 */
function getSummary(data) {
  if (!data || typeof data !== 'object') return '';

  // Extract useful summaries based on common patterns
  if (data.grade) return `Grade: ${data.grade}`;
  if (data.score) return `Score: ${data.score}`;
  if (data.status) return `Status: ${data.status}`;
  if (data.issuer) return `Issuer: ${data.issuer}`;
  if (data.valid) return `Valid: ${data.valid}`;

  return '';
}
