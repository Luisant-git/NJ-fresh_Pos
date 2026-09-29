import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const numberToWords = (num: number): string => {
  if (!num || num === 0) return "ZERO";
  const a = ["", "ONE ", "TWO ", "THREE ", "FOUR ", "FIVE ", "SIX ", "SEVEN ", "EIGHT ", "NINE ", "TEN ", "ELEVEN ", "TWELVE ", "THIRTEEN ", "FOURTEEN ", "FIFTEEN ", "SIXTEEN ", "SEVENTEEN ", "EIGHTEEN ", "NINETEEN "];
  const b = ["", "", "TWENTY ", "THIRTY ", "FORTY ", "FIFTY ", "SIXTY ", "SEVENTY ", "EIGHTY ", "NINETY "];
  const convertWhole = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + "HUNDRED " + (n % 100 !== 0 ? convertWhole(n % 100) : "");
    if (n < 1000000) return convertWhole(Math.floor(n / 1000)) + "THOUSAND " + (n % 1000 !== 0 ? convertWhole(n % 1000) : "");
    return n.toString();
  };
  const whole = Math.floor(num);
  const fraction = Math.round((num - whole) * 100);
  let res = convertWhole(whole);
  if (fraction > 0) res += "AND CENTS " + convertWhole(fraction);
  return res.trim();
};

export const generateNativePdf = (sale: any, settings: any): string => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const companyName = settings?.companyName || 'NJ FRESH AND FROZEN SDN BHD';
  const companyNumber = settings?.companyNumber ? `(${settings.companyNumber})` : '(202001027405(1383725-H))';
  doc.text(`${companyName} ${companyNumber}`, 105, 15, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text('NO 8G, JLN 3/2 PANDAN JAYA, 55100 KUALA LUMPUR.', 105, 21, { align: 'center' });
  doc.text(`Tel : ${settings?.phone || '0392856786, 60129641451'}`, 105, 26, { align: 'center' });
  
  // Invoice Title
  doc.setLineWidth(0.5);
  doc.line(14, 30, 196, 30);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text('INVOICE', 105, 37, { align: 'center' });
  doc.line(14, 42, 196, 42);
  
  // Bill To & Info
  doc.setFontSize(9);
  doc.text('Bill To:', 14, 50);
  doc.text(sale?.customer?.id ? `CUST-${sale.customer.id}` : '', 35, 50);
  doc.text(sale?.customer?.name || 'Cash Customer', 35, 55);
  if (sale?.customer?.address) {
    const splitAddress = doc.splitTextToSize(sale.customer.address, 70);
    doc.text(splitAddress, 35, 60);
  }
  
  doc.text(`TEL: ${sale?.customer?.phone || ''}`, 14, 75);
  doc.text('FAX:', 65, 75);
  doc.text('Attn:', 14, 80);
  
  doc.text('NO.', 120, 50); doc.text(':', 140, 50); doc.text(sale.invoiceNo, 145, 50);
  doc.text('DATE', 120, 55); doc.text(':', 140, 55); doc.text(new Date(sale.date).toISOString().split('T')[0], 145, 55);
  doc.text('PAY TYPE', 120, 60); doc.text(':', 140, 60); doc.text(sale?.paymentMode?.name || 'Cash', 145, 60);
  doc.text('PAGE', 120, 65); doc.text(':', 140, 65); doc.text('1 of 1', 145, 65);
  
  // Table
  const tableData = (sale.items || []).map((item: any) => [
    item.product?.code || '',
    item.product?.name || '',
    Number(item.quantity).toFixed(4),
    item.product?.unit?.name || item.product?.unit?.shortCode || 'Nos',
    Number(item.rate || 0).toFixed(2),
    Number(item.amount || item.total || 0).toFixed(2)
  ]);
  
  autoTable(doc, {
    startY: 85,
    head: [['CODE', 'DESCRIPTION', 'QTY', 'UOM', 'U.PRICE', 'AMOUNT']],
    body: tableData,
    theme: 'plain',
    styles: { fontSize: 9, font: 'helvetica', fontStyle: 'bold', cellPadding: { top: 2, bottom: 2, left: 1, right: 1 } },
    headStyles: { fillColor: false, textColor: 0, fontStyle: 'bold', lineWidth: { top: 0.5, bottom: 0.5 }, lineColor: 0 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 70 },
      2: { cellWidth: 20, halign: 'right' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 20, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' }
    },
    margin: { left: 14, right: 14 }
  });
  
  // Footer pushed to bottom
  const finalY = 230; // Push to bottom of A4 roughly (A4 is 297mm)
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`RINGGIT MALAYSIA ${numberToWords(sale.grandTotal)} ONLY`, 14, finalY);
  
  // Notes
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const notesText = "Note:\n1. All Cheques should be crossed and made payable to NJ FRESH AND FROZEN SDN BHD\n2. ACCOUNT DETAILS:\n     NJ FRESH AND FROZEN SDN BHD\n     ACCOUNT NO- 21419200050230, BANK NAME: RHB bank\n3. Goods sold are neither returnable nor refundable. Otherwise a cancellation fee of 20% on the purchase price will be imposed";
  const splitNotes = doc.splitTextToSize(notesText, 110);
  doc.text(splitNotes, 14, finalY + 10);
  
  // Totals
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text('TOTAL : RM', 130, finalY + 12);
  doc.text(Number(sale.grandTotal).toFixed(2), 196, finalY + 12, { align: 'right' });
  doc.line(160, finalY + 14, 196, finalY + 14);
  
  // Box
  doc.setLineWidth(0.5);
  doc.rect(130, finalY + 18, 66, 8);
  doc.text('PENDING AMT : RM', 132, finalY + 24);
  doc.text(Number(sale.pendingAmount || 0).toFixed(2), 194, finalY + 24, { align: 'right' });
  
  return doc.output('datauristring');
};

export const generateBillByBillPdf = (entityName: string, entityType: 'Customer' | 'Supplier', bills: any[], totals: any) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Header
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text('BILL-BY-BILL BREAKDOWN', 105, 15, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`${entityType.toUpperCase()}: ${entityName}`, 14, 25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
  
  const head = [['Entry / Inv No', 'Bill Date', 'Bill Total', entityType === 'Customer' ? 'Sales Returns' : 'Pur. Returns', entityType === 'Customer' ? 'Received Amount' : 'Paid Amount', 'Pending Balance']];
  
  const body = bills.map(b => [
    b.entryNo || '',
    new Date(b.date).toISOString().split('T')[0],
    Number(b.total).toFixed(2),
    Number(b.returned || 0).toFixed(2),
    Number(b.received || b.paid || 0).toFixed(2),
    Number(b.pending).toFixed(2)
  ]);
  
  body.push([
    'TOTAL',
    '',
    Number(totals.total).toFixed(2),
    Number(totals.returned).toFixed(2),
    Number(totals.received || totals.paid).toFixed(2),
    Number(totals.pending).toFixed(2)
  ]);

  autoTable(doc, {
    startY: 35,
    head: head,
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [248, 250, 252], textColor: 0, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right', fontStyle: 'bold' }
    },
    didParseCell: function (data) {
      if (data.row.index === body.length - 1) { // Total row
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [245, 245, 245];
      }
    }
  });

  return doc.output('bloburl');
};
