import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// TEST SERVER
app.get("/", (req, res) => {
  res.json({ message: "APPK Backend is running 🚀" });
});

// REGISTER (demo)
app.post("/register", (req, res) => {
  res.json({ status: "pending", message: "User registered" });
});

// LOGIN (demo)
app.post("/login", (req, res) => {
  res.json({ status: "ok", message: "Login success" });
});

// APPROVE USER (CEO demo)
app.post("/admin/approve", (req, res) => {
  const now = new Date();
  const expires = new Date();
  expires.setDate(now.getDate() + 360);

  res.json({
    status: "approved",
    approved_at: now,
    expires_at: expires
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`APPK backend running on port ${PORT}`);
});