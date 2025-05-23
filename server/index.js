import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 4000;
const UPLOAD_DIR = path.resolve("uploads");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  const fileId = req.file.filename;
  res.json({ link: `${req.protocol}://${req.get("host")}/api/download/${fileId}`, fileId });
});

app.get("/api/download/:fileId", (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.fileId);
  if (!fs.existsSync(filePath)) return res.status(404).send("Arquivo não encontrado");
  res.download(filePath, err => {
    if (!err) fs.unlink(filePath, () => {}); // Apaga após um download (estilo JustBeamIt)
  });
});

app.listen(PORT, () => console.log(`Server rodando em http://localhost:${PORT}`));