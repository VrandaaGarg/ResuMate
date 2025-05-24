// server.js
import express from "express";
import cors from "cors";
import enhanceRouter from "./api/enhance.js";

const app = express();
const PORT = process.env.PORT || 5000;

console.log("👀 server.js started");

app.use(cors());
app.use(express.json());
app.use("/api", enhanceRouter);

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
