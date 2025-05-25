// server.js
import express from "express";
import cors from "cors";
import enhanceRouter from "./api/enhance.js";

// Only run Express server in local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const app = express();
  const PORT = process.env.PORT || 3001;

  console.log("👀 server.js started in development mode");

  app.use(cors());
  app.use(express.json());
  app.use("/api", enhanceRouter);

  app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
  });
} else {
  console.log("📦 Running in serverless mode");
}
