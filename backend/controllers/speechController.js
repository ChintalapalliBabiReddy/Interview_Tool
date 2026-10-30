
const sdk = require("microsoft-cognitiveservices-speech-sdk");

// Existing WAV transcription endpoint — retained.
const transcribeSpeech = async (req, res) => {
  try {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
      return res.status(500).json({
        success: false,
        message: "Azure Speech configuration is missing",
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "WAV audio file is required",
      });
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      speechKey,
      speechRegion
    );

    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = sdk.AudioConfig.fromWavFileInput(req.file.buffer);
    const recognizer = new sdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close();

        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          return res.status(200).json({
            success: true,
            text: result.text,
          });
        }

        if (result.reason === sdk.ResultReason.NoMatch) {
          return res.status(200).json({
            success: true,
            text: "",
            message: "No speech was recognized",
          });
        }

        console.error("Speech recognition failed:", result.errorDetails);

        return res.status(502).json({
          success: false,
          message: "Azure could not recognize the audio",
        });
      },
      (error) => {
        recognizer.close();
        console.error("Azure Speech error:", error);

        if (!res.headersSent) {
          return res.status(502).json({
            success: false,
            message: "Speech transcription failed",
          });
        }
      }
    );
  } catch (error) {
    console.error("Speech transcription error:", error);

    return res.status(500).json({
      success: false,
      message: "Speech transcription failed",
    });
  }
};

// New endpoint — creates a short-lived authorization token.
const getSpeechToken = async (req, res) => {
  try {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
      return res.status(500).json({
        success: false,
        message: "Azure Speech configuration is missing",
      });
    }

    const tokenResponse = await fetch(
      `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": speechKey,
          "Content-Length": "0",
        },
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(
        `Azure token request failed: ${tokenResponse.status}`
      );
    }

    const token = await tokenResponse.text();

    return res.status(200).json({
      success: true,
      token,
      region: speechRegion,
    });
  } catch (error) {
    console.error("Speech token generation failed:", error.message);

    return res.status(502).json({
      success: false,
      message: "Could not generate Speech authorization token",
    });
  }
};

module.exports = {
  transcribeSpeech,
  getSpeechToken,
};
