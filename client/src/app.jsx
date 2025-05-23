import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

export default function App() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFile = e => setFile(e.target.files[0]);

  const uploadFile = async e => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setLink("");
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await axios.post(`${API_URL}/upload`, data, {
        onUploadProgress: p => setProgress(Math.round((p.loaded / p.total) * 100))
      });
      setLink(res.data.link);
    } catch (err) {
      alert("Erro ao enviar arquivo");
    }
    setUploading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>linkp2p</h2>
      <form onSubmit={uploadFile}>
        <input type="file" onChange={handleFile} disabled={uploading} />
        <br /><br />
        <button type="submit" disabled={!file || uploading}>Enviar</button>
      </form>
      {uploading && <div>Enviando: {progress}%</div>}
      {link && (
        <div style={{ marginTop: 20 }}>
          <b>Link para compartilhar:</b>
          <div>
            <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
          </div>
          <div style={{ color: "gray", fontSize: 12 }}>(O arquivo só pode ser baixado uma vez!)</div>
        </div>
      )}
    </div>
  );
}