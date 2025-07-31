export const printCoverLetter = (content: string, jobTitle: string): void => {
  const printWindow = window.open("", "", "width=800,height=600");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="he">
    <head>
      <meta charset="UTF-8" />
      <title>מכתב מקדים - ${jobTitle}</title>
      <style>
        body {
          direction: rtl;
          font-family: Calibri, Arial, sans-serif;
          padding: 40px;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        h1 {
          text-align: center;
          margin-bottom: 2rem;
        }
      </style>
    </head>
    <body>
      <h1>מכתב מקדים - ${jobTitle}</h1>
      <div>${content.replace(/\n/g, "<br/>")}</div>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print(); // או .save כ־PDF אם יש הרחבת PDF מותקנת
  // printWindow.close(); ← אפשר לסגור אוטומטית אם רוצים
};
