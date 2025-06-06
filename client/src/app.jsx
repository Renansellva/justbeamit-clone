// Arquivo: src/app.jsx

import React, { useState } from "react";
import axios from "axios";
// import './App.css'; // ou './style.css'


const API_URL = "https://linkp2p.onrender.com/api";
//const API_URL = "http://localhost:4000/api";

// Definição do componente PixCafezinho (como já tínhamos)
function PixCafezinho() {
  return (
    <div className="pix-cafezinho">
      <img src="/pixQrCode.jpeg" alt="QR Code Pix para um cafezinho" />
      <span>Pix para um cafezinho ☕
        
      </span>
    </div>
  );
}

// Componente principal da sua aplicação
export default function App() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [feedbackCopia, setFeedbackCopia] = useState('');

  const handleFile = e => {
    setFile(e.target.files[0]);
    setLink("");
    setProgress(0);
    setFeedbackCopia("");
  };

  const uploadFile = async e => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setLink("");
    setFeedbackCopia("");
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await axios.post(`${API_URL}/upload`, data, {
        onUploadProgress: p => {
          if (p.total) {
            setProgress(Math.round((p.loaded / p.total) * 100));
          } else {
            setProgress(0);
          }
        }
      });
      setLink(res.data.link);
    } catch (err) {
      console.error("Erro ao enviar arquivo:", err);
      alert("Erro ao enviar arquivo. Verifique o console ou tente novamente.");
      setLink("");
    }
    setUploading(false);
  };

  const copiarLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setFeedbackCopia('Link copiado!');
      setTimeout(() => setFeedbackCopia(''), 2000);
    } catch (err) {
      console.error('Falha ao copiar o link: ', err);
      setFeedbackCopia('Falha ao copiar!');
      setTimeout(() => setFeedbackCopia(''), 2000);
    }
  };

  // Função para o botão de sugestões
  const handleSugestoesClick = () => {
    const seuEmail = ""; 
    const assunto = encodeURIComponent("Sugestão para o Linkp2p");
    const corpoEmail = encodeURIComponent("Olá,\n\nEu tenho a seguinte sugestão para o site Linkp2p:\n\n");
    window.location.href = `mailto:${seuEmail}?subject=${assunto}&body=${corpoEmail}`;
  };

  return (
    <>
      <div className="container" style={{ fontFamily: "sans-serif" }}>
        <h2>linkp2p</h2>
        <form onSubmit={uploadFile}>
          <div>
            <input
              id="file-upload"
              type="file"
              onChange={handleFile}
              disabled={uploading}
              style={{ marginBottom: '20px' }}
            />
          </div>
          <button type="submit" className="btn-enviar" disabled={!file || uploading}>
            {uploading ? `Enviando: ${progress}%` : "Enviar"}
          </button>
        </form>

        {link && (
          <div className="link-container" style={{ marginTop: '20px' }}>
            <b>Link para compartilhar:</b>
            <div style={{ margin: '10px 0' }}>
              <input
                type="text"
                value={link}
                readOnly
                onClick={(e) => e.target.select()}
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1.8px solid #313b5f', background: '#1a1c29', color: '#f4f6fa' }}
              />
            </div>
            <button onClick={copiarLink} className="button" style={{ width: '100%' }}>
              Copiar Link
            </button>
            {feedbackCopia && (
              <p className="feedback-message" style={{ marginTop: '10px', fontSize: '0.9rem', color: feedbackCopia.includes('Falha') ? '#ff8a8a' : '#30e88b', fontWeight: '600' }}>
                {feedbackCopia}
              </p>
            )}
            <div className="download-once-message" style={{ color: "gray", fontSize: '0.85rem', marginTop: '15px' }}>
              (O arquivo só pode ser baixado uma vez!)
            </div>
          </div>
        )}
      </div>

      {/* Botão de Sugestões */}
      <button onClick={handleSugestoesClick} className="sugestoes-button">
        Sugestões
      </button>

      <PixCafezinho />
    </>
  );
}