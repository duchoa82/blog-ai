import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Health check for Railway
app.get("/healthz", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    message: "Simple server running"
  });
});

// Basic route
app.get("/", (req, res) => {
  res.json({ 
    message: "Blog AI Backend is running!",
    timestamp: new Date().toISOString()
  });
});

// Serve static files from frontend dist
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Simple Backend running on port ${PORT}`);
  console.log(`🔗 Health check: /healthz`);
  console.log(`🔗 Root: /`);
});
