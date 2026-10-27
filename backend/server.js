
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const speechRoutes = require("./routes/speechRoutes");
const { connectRedis } = require("./config/redisClient");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/speech", speechRoutes);
app.use("/api/interview", interviewRoutes);

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    // Connect Redis before accepting requests.
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
