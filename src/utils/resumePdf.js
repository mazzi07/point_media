import html2pdf from 'html2pdf.js';

export function generateResumePdf(element, filename) {
  const options = {
    margin: 10,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  return html2pdf().set(options).from(element).save();
}
