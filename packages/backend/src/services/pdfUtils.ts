import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * מפענח טקסט מקובץ קורות חיים (PDF או DOCX)
 * @param buffer - תוכן הקובץ בפורמט Buffer
 * @returns הטקסט הגולמי שנמצא בקובץ
 */
export const parseResumeText = async (buffer: Buffer): Promise<string> => {
  const header = buffer.slice(0, 4).toString();

  if (header === '%PDF') {
    // קובץ PDF
    const data = await pdfParse(buffer);
    return data.text;
  }

  // ננסה לקרוא כ־DOCX
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error('פורמט קובץ לא נתמך או שהקובץ פגום');
  }
};
