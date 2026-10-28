
const path = require("node:path");
const mammoth = require("mammoth");
const { PDFParse } = require("pdf-parse");

const extractResumeText = async (file) => {
  if (!file || !file.buffer || !file.originalname) {
    throw new Error("A valid resume file is required");
  }

  const extension = path.extname(file.originalname).toLowerCase();
  let extractedText = "";

  if (extension === ".pdf") {
    const parser = new PDFParse({ data: file.buffer });

    try {
      const result = await parser.getText();
      extractedText = result.text || "";
    } finally {
      await parser.destroy();
    }
  } else if (extension === ".docx") {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    extractedText = result.value || "";
  } else {
    throw new Error("Unsupported resume format. Upload a PDF or DOCX file.");
  }

  extractedText = extractedText
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!extractedText) {
    throw new Error(
      "No readable text was found in the resume. If this is a scanned PDF, OCR may be required."
    );
  }

  return extractedText;
};

module.exports = { extractResumeText };
