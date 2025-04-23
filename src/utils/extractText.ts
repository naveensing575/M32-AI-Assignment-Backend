import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const extractTextFromFile = async (
  buffer: Buffer,
  mimetype: string
): Promise<string> => {
  switch (mimetype) {
    case "application/pdf": {
      const data = await pdfParse(buffer);
      return data.text;
    }

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    case "text/plain":
    case "text/markdown": {
      return buffer.toString("utf8");
    }

    default:
      throw new Error(`Unsupported file type: ${mimetype}`);
  }
};
