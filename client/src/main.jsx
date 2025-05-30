 import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



// Dentro do seu componente React
// import React, { useState } from 'react';

function SeuComponenteQueExibeOLink() {
  const [downloadLink, setDownloadLink] = useState(''); // Você vai popular isso com o link do backend
  const [feedbackCopia, setFeedbackCopia] = useState('');

  // Função para simular o recebimento do link (substitua pela sua lógica com Axios)
  const simularRecebimentoLink = () => {
    // Exemplo de link que seria retornado pelo backend (já encurtado)
    const linkDoBackend = 'http://localhost:4000/api/s/ABC1234';
    setDownloadLink(linkDoBackend);
    setFeedbackCopia(''); // Limpa feedback anterior
  };

  const copiarLink = async () => {
    if (!downloadLink) return;

    try {
      await navigator.clipboard.writeText(downloadLink);
      setFeedbackCopia('Link copiado!');
      setTimeout(() => setFeedbackCopia(''), 2000); // Limpa o feedback após 2 segundos
    } catch (err) {
      console.error('Falha ao copiar o link: ', err);
      setFeedbackCopia('Falha ao copiar!');
      setTimeout(() => setFeedbackCopia(''), 2000);
    }
  };

  return (
    <div>
      {/* Botão para simular o upload e obter o link */}
      <button onClick={simularRecebimentoLink} className="btn-enviar" style={{ marginBottom: '10px' }}>Gerar Link de Exemplo</button>

      {downloadLink && (
        <div className="link-container">
          <p><strong>Seu link encurtado:</strong></p>
          <input type="text" value={downloadLink} readOnly style={{ marginBottom: '5px' }} />
          <button onClick={copiarLink} className="button">Copiar Link</button>
          {feedbackCopia && <p className="feedback-message">{feedbackCopia}</p>}
        </div>
      )}
    </div>
  );
}

export default SeuComponenteQueExibeOLink;