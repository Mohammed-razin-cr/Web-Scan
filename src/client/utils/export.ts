/**
 * Export utilities — PDF (jsPDF) + CSV downloads
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ── brand palette ── */
const TEAL   = [76,  225, 211] as [number, number, number];
const DARK   = [6,   18,  16]  as [number, number, number];
const MID    = [17,  100, 102] as [number, number, number];
const WHITE  = [255, 255, 255] as [number, number, number];
const GREY   = [160, 185, 180] as [number, number, number];
const LGREY  = [230, 240, 238] as [number, number, number];
const AMBER  = [255, 203, 154] as [number, number, number];

/* ─────────────────────────────────────────────────
   Main dispatcher
───────────────────────────────────────────────── */
export const exportScan = (format: string, scanData: any) => {
  try {
    if (format === 'pdf')      exportAsPDF(scanData);
    else if (format === 'csv') exportAsCSV(scanData);
    else throw new Error(`Unsupported format: ${format}`);
  } catch (error) {
    console.error('Export error:', error);
    throw new Error(`Failed to export as ${format.toUpperCase()}`);
  }
};

/* ─────────────────────────────────────────────────
   PDF — real downloadable file via jsPDF
───────────────────────────────────────────────── */
export const exportAsPDF = (scanData: any) => {
  const address   = scanData.address || 'Unknown URL';
  const timestamp = new Date().toLocaleString();
  const results   = (scanData.results || []) as any[];
  const doc       = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW        = doc.internal.pageSize.getWidth();   // 210
  const PH        = doc.internal.pageSize.getHeight();  // 297
  let   y         = 0;

  /* ── helper: add new page when close to bottom ── */
  const checkPage = (needed = 20) => {
    if (y + needed > PH - 18) {
      doc.addPage();
      drawPageFooter();
      y = 22;
    }
  };

  /* ── page footer ── */
  const drawPageFooter = () => {
    const pg = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(...GREY);
    doc.text(`WebScan Security Report  ·  ${address}`, 14, PH - 8);
    doc.text(`Page ${pg}`, PW - 14, PH - 8, { align: 'right' });
    doc.setDrawColor(...TEAL);
    doc.setLineWidth(0.3);
    doc.line(14, PH - 12, PW - 14, PH - 12);
  };

  /* ══════════════════════════════════════════════
     PAGE 1 — Cover
  ══════════════════════════════════════════════ */

  /* full-bleed dark header */
  doc.setFillColor(...DARK);
  doc.rect(0, 0, PW, 68, 'F');

  /* teal accent bar on left edge */
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, 4, 68, 'F');

  /* amber accent top stripe */
  doc.setFillColor(...AMBER);
  doc.rect(0, 0, PW, 1.5, 'F');

  /* logo placeholder circle */
  doc.setFillColor(...MID);
  doc.circle(20, 20, 7, 'F');
  doc.setFillColor(...TEAL);
  doc.circle(20, 20, 5, 'F');

  /* brand name */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...TEAL);
  doc.text('WEBSCAN', 30, 18);
  doc.setFontSize(7);
  doc.setTextColor(...GREY);
  doc.text('ANALYZE · DETECT · PROTECT', 30, 23.5);

  /* main headline */
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('Security Analysis', 14, 46);
  doc.setTextColor(...TEAL);
  doc.text('Report', 14, 56);

  /* date stamp */
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  doc.text(timestamp, PW - 14, 56, { align: 'right' });

  y = 76;

  /* ── target info card ── */
  doc.setFillColor(...LGREY);
  doc.roundedRect(14, y, PW - 28, 28, 3, 3, 'F');
  doc.setFillColor(...TEAL);
  doc.roundedRect(14, y, 3, 28, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...MID);
  doc.text('TARGET', 22, y + 8);
  doc.setFontSize(13);
  doc.setTextColor(...DARK);
  doc.text(address, 22, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text(`Scan completed ${timestamp}`, 22, y + 24);

  y += 38;

  /* ── summary stats row ── */
  const total    = results.length;
  const critical = results.filter(r => r.severity === 'critical').length;
  const warning  = results.filter(r => r.severity === 'warning').length;
  const ok       = total - critical - warning;

  const stats = [
    { label: 'Total Checks', value: String(total),    color: TEAL  },
    { label: 'Passed',       value: String(ok),        color: [76,175,80]  as [number,number,number] },
    { label: 'Warnings',     value: String(warning),   color: [255,152,0]  as [number,number,number] },
    { label: 'Critical',     value: String(critical),  color: [244,67,54]  as [number,number,number] },
  ];

  const boxW = (PW - 28 - 9) / 4;
  stats.forEach((s, i) => {
    const bx = 14 + i * (boxW + 3);
    doc.setFillColor(s.color[0], s.color[1], s.color[2]);
    doc.roundedRect(bx, y, boxW, 22, 2, 2, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(s.value, bx + boxW / 2, y + 13, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(s.label.toUpperCase(), bx + boxW / 2, y + 19.5, { align: 'center' });
  });

  y += 32;

  /* ── section heading ── */
  doc.setFillColor(...TEAL);
  doc.rect(14, y, PW - 28, 0.5, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...MID);
  y += 6;
  doc.text('DETAILED SCAN RESULTS', 14, y);
  y += 8;

  /* ══════════════════════════════════════════════
     Results table
  ══════════════════════════════════════════════ */
  const tableBody = results.map((r: any, idx: number) => {
    let dataStr = '';
    try {
      const raw = r.data;
      if (typeof raw === 'string') dataStr = raw.slice(0, 280);
      else if (raw != null)        dataStr = JSON.stringify(raw, null, 1).slice(0, 280);
    } catch { dataStr = ''; }
    if (dataStr.length === 280) dataStr += '…';

    return [
      String(idx + 1),
      r.title || 'Unknown',
      (r.tags || []).join(', ') || '—',
      (r.severity || 'info').toUpperCase(),
      dataStr,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['#', 'Check', 'Category', 'Severity', 'Details']],
    body: tableBody,
    margin: { left: 14, right: 14 },
    tableWidth: PW - 28,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      lineColor: [220, 235, 230],
      lineWidth: 0.2,
      textColor: DARK,
    },
    headStyles: {
      fillColor: DARK,
      textColor: TEAL,
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 8,  halign: 'center' },
      1: { cellWidth: 38, fontStyle: 'bold' },
      2: { cellWidth: 30 },
      3: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 'auto' },
    },
    alternateRowStyles: { fillColor: [245, 250, 249] },
    didParseCell: (data: any) => {
      /* severity colour coding */
      if (data.column.index === 3 && data.section === 'body') {
        const sev = String(data.cell.raw).toLowerCase();
        if (sev === 'CRITICAL') data.cell.styles.textColor = [220, 50, 50];
        else if (sev === 'WARNING') data.cell.styles.textColor = [200, 120, 20];
        else data.cell.styles.textColor = [40, 160, 140];
      }
    },
    didDrawPage: () => { drawPageFooter(); },
  });

  /* ── last page footer ── */
  drawPageFooter();

  /* ── final page: footer note ── */
  const lastY = (doc as any).lastAutoTable?.finalY ?? PH - 40;
  if (lastY < PH - 38) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...GREY);
    doc.text(
      'Generated by WebScan | Website Intelligence & Security Analysis Platform',
      PW / 2,
      lastY + 14,
      { align: 'center' },
    );
  }

  /* ── save ── */
  const safeName = address.replace(/[^a-z0-9.-]/gi, '_').slice(0, 60);
  doc.save(`webscan-${safeName}-${Date.now()}.pdf`);
};

/* ─────────────────────────────────────────────────
   CSV export (unchanged logic, cleaner filename)
───────────────────────────────────────────────── */
export const exportAsCSV = (scanData: any) => {
  const address   = scanData.address || 'unknown';
  const timestamp = new Date().toISOString();

  const headers = ['Timestamp', 'URL', 'Check Name', 'Category', 'Severity', 'Status', 'Data'];

  const rows = (scanData.results || []).map((result: any) => [
    timestamp,
    address,
    result.title   || 'Unknown',
    (result.tags   || []).join('; ') || 'N/A',
    result.severity || 'info',
    result.status  || 'completed',
    JSON.stringify(result.data || {}),
  ]);

  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map((row: any[]) =>
      row.map((cell: any) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','),
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href     = URL.createObjectURL(blob);
  link.download = `webscan-${address}-${Date.now()}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/* kept for any legacy callers */
export const exportAsHTMLPDF  = exportAsPDF;
export const generateReportHTML = (_: any) => '';
