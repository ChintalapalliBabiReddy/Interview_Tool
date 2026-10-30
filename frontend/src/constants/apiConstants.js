
 // Backend API base URL
export const API_BASE_URL =
  "https://ai-interview-backend-dafdacbndpgfczbw.southindia-01.azurewebsites.net/api";
  
// Authentication and other API endpoints
export const AUTH_API = {
  SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  AUTH_ME: `${API_BASE_URL}/auth/me`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  RESUME_UPLOAD_API: `${API_BASE_URL}/resume/upload`,
  AI_API_GENERATE_ANSWER: `${API_BASE_URL}/ai/answer`,
  SPEECH_TRANSCRIBE: `${API_BASE_URL}/speech/transcribe`,
  SPEECH_TOKEN: `${API_BASE_URL}/speech/token`,
  INTERVIEW_SESSION_API: `${API_BASE_URL}/interview/session`,
};
