declare module 'pdf-parse' {
  import { Buffer } from 'buffer';

  interface PDFParseData {
    text: string;
  }

  function pdfParse(dataBuffer: Buffer): Promise<PDFParseData>;

  export = pdfParse;
}
