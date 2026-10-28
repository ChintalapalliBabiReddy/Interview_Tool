
const { containerClient } = require("../config/azureStorage");
const {
  extractResumeText,
} = require("../services/resumeProcessingService");
const {
  saveResume,
} = require("../services/resumeStore");
const path = require("node:path");

// Upload resume to Azure Blob Storage and extract its text.
const uploadResume = async (req, res) => {
  let uploadedBlobClient;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();

    if (![".pdf", ".docx"].includes(extension)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported resume format. Upload a PDF or DOCX file.",
      });
    }

    // Extract text before saving it for the interview.
    const resumeText = await extractResumeText(req.file);

    // Preserve the existing Azure Blob Storage upload.
    const blobName = `${Date.now()}-${req.file.originalname}`;
    uploadedBlobClient = containerClient.getBlockBlobClient(blobName);

    await uploadedBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: {
        blobContentType: req.file.mimetype,
      },
    });

    // Store resume metadata and extracted text in Redis.
    const { resumeId } = await saveResume({
      blobName,
      fileName: req.file.originalname,
      text: resumeText,
    });

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and processed successfully",
      fileName: req.file.originalname,
      blobName,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      resumeId,
    });
  } catch (error) {
    console.error("Resume upload or processing failed:", error);

    // Avoid leaving an orphaned Blob if the upload succeeded
    // but saving the resume record in Redis failed.
    if (uploadedBlobClient) {
      try {
        await uploadedBlobClient.deleteIfExists();
      } catch (cleanupError) {
        console.error(
          "Failed to clean up uploaded resume blob:",
          cleanupError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to upload or process the resume",
    });
  }
};

module.exports = { uploadResume };
