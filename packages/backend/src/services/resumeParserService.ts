import  mammoth from 'mammoth'; // לייבוא נכון של mammoth
import  pdfParse from 'pdf-parse'; // לייבוא נכון של pdf-parse

// הפונקציה parseResumeText מקבלת את ה-buffer של הקובץ ואת ה-mimetype שלו
export const parseResumeText = async (buffer: Buffer, mimetype: string): Promise<string> => {
  try {
    // בדיקה לפי mimetype שהתקבל מהבקשה
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // DOCX
      const result = await mammoth.extractRawText({ buffer: buffer });
      return result.value;
    } else {
      // אם סוג הקובץ לא נתמך לפי ה-mimetype
      throw new Error('סוג הקובץ לא נתמך. יש לשלוח קובץ PDF או DOCX בלבד.');
    }
  } catch (error: any) {
    console.error("שגיאה בניתוח קורות חיים:", error);
    // זריקת השגיאה הלאה כדי שה-controller יוכל לטפל בה
    throw new Error(`שגיאה בניתוח קורות חיים: ${error.message || error}`);
  }
};
