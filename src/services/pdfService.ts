import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { InspectionReport } from './reportService';
import logoUrl from '../assets/logoBOA.jpeg';

// Converte uma URL de imagem para base64 via Canvas
const imageToBase64 = (src: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = reject;
    img.src = src;
  });

const BRAND_COLOR: [number, number, number] = [30, 30, 30];
const ACCENT_COLOR: [number, number, number] = [255, 107, 53];
const LIGHT_GRAY: [number, number, number] = [245, 245, 245];
const DARK_TEXT: [number, number, number] = [30, 30, 30];
const MUTED_TEXT: [number, number, number] = [100, 100, 100];

const evalLabel = (val: string) => {
  switch (val) {
    case 'approved': return 'Approved';
    case 'rejected': return 'Rejected';
    case 'rework':   return 'Rework Needed';
    default:         return val;
  }
};

const statusLabel = (val: string) => {
  switch (val) {
    case 'approved': return 'APPROVED';
    case 'rejected': return 'REJECTED';
    case 'pending':  return 'PENDING';
    default:         return val.toUpperCase();
  }
};

const statusColor = (val: string): [number, number, number] => {
  switch (val) {
    case 'approved': return [39, 174, 96];
    case 'rejected': return [231, 76, 60];
    default:         return [243, 156, 18];
  }
};

const pineTypeLabel = (val: string) => {
  switch (val) {
    case 'pine100':   return 'Pine 100%';
    case 'combiPine': return 'Combi Pine';
    case 'combiEuca': return 'Combi Euca';
    default:          return val;
  }
};

export const generateReportPDF = async (report: InspectionReport): Promise<void> => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ── HEADER BACKGROUND ─────────────────────────────────────────────────────
  const headerH = 46;
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, pageW, headerH, 'F');

  // Accent bar
  doc.setFillColor(...ACCENT_COLOR);
  doc.rect(0, headerH, pageW, 2, 'F');

  // Logo (top-right)
  const logoSize = 34;
  const logoX = pageW - margin - logoSize;
  const logoY = 6;
  try {
    const logoB64 = await imageToBase64(logoUrl);
    doc.addImage(logoB64, 'JPEG', logoX, logoY, logoSize, logoSize);
  } catch {
    // Se falhar ao carregar a logo, continua sem ela
  }

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('INSPECTION REPORT', margin, 18);

  // Status badge (abaixo do título)
  const statusCol = statusColor(report.status);
  doc.setFillColor(...statusCol);
  doc.roundedRect(margin, 23, 40, 12, 3, 3, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(statusLabel(report.status), margin + 20, 30.5, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 180, 180);
  doc.text(
    `Order: ${report.orderNumber}  •  ${report.inspectionDate}  •  ${report.location}`,
    margin + 44,
    30.5
  );

  y = headerH + 10;

  // ── SECTION HELPER ────────────────────────────────────────────────────────
  const sectionTitle = (title: string) => {
    doc.setFillColor(...ACCENT_COLOR);
    doc.rect(margin, y, 3, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...DARK_TEXT);
    doc.text(title, margin + 6, y + 5);
    y += 11;
  };

  const addLabelValue = (label: string, value: string, x: number, colW: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED_TEXT);
    doc.text(label, x, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_TEXT);
    const lines = doc.splitTextToSize(value || '—', colW - 2);
    doc.text(lines, x, y + 4);
    return lines.length * 4.5;
  };

  const checkNewPage = (needed: number) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // ── BASIC INFORMATION ─────────────────────────────────────────────────────
  sectionTitle('Basic Information');

  const col = contentW / 3;
  const rows = [
    ['Item Inspected', report.itemInspected, 'Mill / Supplier', report.millSupplier, 'Pine Type', pineTypeLabel(report.pineType)],
    ['Inspection Date', report.inspectionDate, 'Order Number', report.orderNumber, 'Location', report.location],
    ['Piles', report.piles || '—', '', '', '', ''],
  ];

  for (const row of rows) {
    const h1 = addLabelValue(row[0], row[1], margin, col);
    const h2 = row[2] ? addLabelValue(row[2], row[3], margin + col, col) : 0;
    const h3 = row[4] ? addLabelValue(row[4], row[5], margin + col * 2, col) : 0;
    y += Math.max(h1, h2, h3) + 5;
  }

  y += 4;

  // ── EVALUATIONS ───────────────────────────────────────────────────────────
  checkNewPage(40);
  sectionTitle('Evaluations');

  const evalColor = (val: string): [number, number, number] => {
    if (val === 'approved') return [39, 174, 96];
    if (val === 'rejected') return [231, 76, 60];
    return [243, 156, 18];
  };

  const evalData = [
    ['Dimensional Evaluation', evalLabel(report.dimensionalEval), report.dimensionalEval],
    ['Visual Evaluation', evalLabel(report.visualEval), report.visualEval],
    ['Packaging & Overall', evalLabel(report.packagingEval), report.packagingEval],
    ['Lot Treatment', evalLabel(report.lotTreatment), report.lotTreatment],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Evaluation', 'Result']],
    body: evalData.map(([name, label]) => [name, label]),
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: BRAND_COLOR, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
    columnStyles: {
      0: { cellWidth: contentW * 0.65 },
      1: { cellWidth: contentW * 0.35, fontStyle: 'bold' },
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const val = evalData[data.row.index][2];
        const col = evalColor(val);
        doc.setTextColor(...col);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(
          evalData[data.row.index][1],
          data.cell.x + data.cell.width / 2,
          data.cell.y + data.cell.height / 2 + 1,
          { align: 'center' }
        );
      }
    },
    theme: 'grid',
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // ── DEFECTS ───────────────────────────────────────────────────────────────
  const defectsWithQty = report.defects.filter(d => d.qty && d.qty !== '0' && d.qty !== '');
  checkNewPage(30);
  sectionTitle('Defects');

  if (defectsWithQty.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED_TEXT);
    doc.text('No defects recorded.', margin, y);
    y += 8;
  } else {
    autoTable(doc, {
      startY: y,
      head: [['Defect', 'Description', 'Qty']],
      body: defectsWithQty.map(d => [d.name, d.description || '—', d.qty]),
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: BRAND_COLOR, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      columnStyles: {
        0: { cellWidth: contentW * 0.40 },
        1: { cellWidth: contentW * 0.45 },
        2: { cellWidth: contentW * 0.15, halign: 'center' },
      },
      theme: 'striped',
      alternateRowStyles: { fillColor: LIGHT_GRAY },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── DIMENSIONAL RECORDS ───────────────────────────────────────────────────
  checkNewPage(40);
  sectionTitle('Dimensional Records');

  const dimCategories = [
    { label: 'Length', values: report.dimensionalRecords.length, unit: report.dimensionalRecords.lengthUnit },
    { label: 'Width', values: report.dimensionalRecords.width, unit: report.dimensionalRecords.widthUnit },
    { label: 'Thickness', values: report.dimensionalRecords.thickness, unit: report.dimensionalRecords.thicknessUnit },
    { label: 'Squareness', values: report.dimensionalRecords.squareness, unit: report.dimensionalRecords.squarenessUnit },
  ];

  const dimBody = dimCategories
    .filter(d => d.values && d.values.some(v => v.trim() !== ''))
    .map(d => [
      d.label,
      d.unit || 'mm',
      (d.values || []).filter(v => v.trim() !== '').join(' | ') || '—',
    ]);

  if (dimBody.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Dimension', 'Unit', 'Measurements']],
      body: dimBody,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: BRAND_COLOR, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      columnStyles: {
        0: { cellWidth: contentW * 0.20, fontStyle: 'bold' },
        1: { cellWidth: contentW * 0.15, halign: 'center' },
        2: { cellWidth: contentW * 0.65 },
      },
      theme: 'grid',
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED_TEXT);
    doc.text('No dimensional records.', margin, y);
    y += 8;
  }

  // ── IMAGES SUMMARY ────────────────────────────────────────────────────────
  checkNewPage(30);
  sectionTitle('Image Summary');

  const imageCategories = [
    { label: 'Length',              count: report.images?.length?.length || 0 },
    { label: 'Width',               count: report.images?.width?.length || 0 },
    { label: 'Thickness',           count: report.images?.thickness?.length || 0 },
    { label: 'Squareness',          count: report.images?.square?.length || 0 },
    { label: 'Face',                count: report.images?.face?.length || 0 },
    { label: 'Back Face',           count: report.images?.backFace?.length || 0 },
    { label: 'Palette',             count: report.images?.palette?.length || 0 },
    { label: 'Paint',               count: report.images?.paint?.length || 0 },
    { label: 'Construction Defect', count: report.images?.constructionDefect?.length || 0 },
    { label: 'Stamp',               count: report.images?.stamp?.length || 0 },
    { label: 'Edge',                count: report.images?.edge?.length || 0 },
    { label: 'Height/Support',      count: report.images?.height?.length || 0 },
  ];

  const totalImages = imageCategories.reduce((s, c) => s + c.count, 0);

  autoTable(doc, {
    startY: y,
    head: [['Category', 'Images Uploaded']],
    body: imageCategories.map(c => [c.label, c.count > 0 ? `${c.count} image(s)` : 'None']),
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: BRAND_COLOR, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
    columnStyles: {
      0: { cellWidth: contentW * 0.70 },
      1: { cellWidth: contentW * 0.30, halign: 'center' },
    },
    theme: 'striped',
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    foot: [['Total', `${totalImages} image(s)`]],
    footStyles: { fillColor: LIGHT_GRAY, textColor: DARK_TEXT, fontStyle: 'bold' },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // ── FOOTER ON ALL PAGES ───────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(245, 245, 245);
    doc.rect(0, pageH - 12, pageW, 12, 'F');
    doc.setFillColor(...ACCENT_COLOR);
    doc.rect(0, pageH - 12, pageW, 0.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED_TEXT);
    doc.text(`PHV Inspection System  •  Generated on ${new Date().toLocaleDateString('pt-BR')}`, margin, pageH - 4.5);
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 4.5, { align: 'right' });
  }

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const fileName = `report_${report.orderNumber || report.id}_${report.inspectionDate}.pdf`
    .replace(/[^a-zA-Z0-9_.-]/g, '_');
  doc.save(fileName);
};
