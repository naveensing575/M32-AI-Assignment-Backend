import { Document, Packer, Paragraph, TextRun } from "docx";
import { Response } from "express";

export const exportToDocx = async (
  res: Response,
  content: string,
  filename = "ai-output.docx"
) => {
  const lines = content.split("\n").map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line.trim(), break: 1 })],
      })
  );

  const doc = new Document({ sections: [{ children: lines }] });
  const buffer = await Packer.toBuffer(doc);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(buffer);
};
