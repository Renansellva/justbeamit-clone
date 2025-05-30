import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid"; // Gera IDs curtos

const app = express();
const PORT = 4000; // Porta única e consistente
const UPLOAD_DIR = path.resolve("uploads");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.use(cors());
app.use(express.json());

// Configuração do Multer para salvar arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Mapa para associar shortId ao nome real do arquivo
const linkMap = new Map();

// Rota raiz (opcional)
app.get("/", (req, res) => {
  res.send("Servidor está funcionando! 🚀");
});

// Upload com link curto
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  const actualFilename = req.file.filename;
  const shortId = nanoid(7);

  linkMap.set(shortId, actualFilename);

  const PUBLIC_URL = process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`;

  res.json({
    link: `${PUBLIC_URL}/api/s/${shortId}`,
    shortId
  });
});

// Download via shortId
app.get("/api/s/:shortId", (req, res) => {
  const { shortId } = req.params;
  const actualFilename = linkMap.get(shortId);

  if (!actualFilename) {
    return res.status(404).send("Link não encontrado ou expirado.");
  }

  const filePath = path.join(UPLOAD_DIR, actualFilename);
  if (!fs.existsSync(filePath)) {
    linkMap.delete(shortId);
    return res.status(404).send("Arquivo não encontrado.");
  }

  res.download(filePath, actualFilename, err => {
    if (!err) {
      fs.unlink(filePath, unlinkErr => {
        if (unlinkErr) {
          console.error("Erro ao deletar o arquivo:", unlinkErr);
        } else {
          console.log("Arquivo deletado:", filePath);
        }
      });
      linkMap.delete(shortId);
    } else {
      console.error("Erro durante o download:", err);
    }
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
