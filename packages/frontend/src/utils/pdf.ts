import jsPDF from "jspdf";

export function exportToPdf(content: string, title: string) {
  const doc = new jsPDF();
  doc.setFont("Calibri", "normal");
  doc.setFontSize(14);
  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 10, 20);
  doc.save(`${title}.pdf`);
}
