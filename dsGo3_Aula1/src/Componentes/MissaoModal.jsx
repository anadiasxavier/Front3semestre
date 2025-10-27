import { useState, useEffect, useRef } from "react";
import sucesso from "../assets/sucesso.png";
import erro from "../assets/semsucesso.png";

export function MissaoModal({ missao, onClose, onConcluir }) {
  const [resposta, setResposta] = useState("");
  const [resultado, setResultado] = useState(null);
  const [status, setStatus] = useState(null);
  const inputRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const verificarResposta = () => {
    if (!resposta.trim()) {
      setResultado("Por favor, digite uma resposta antes de enviar!");
      setStatus("alerta");
      return;
    }

    if (
      resposta.trim().toLowerCase() ===
      missao.respostaCorreta.trim().toLowerCase()
    ) {
      setResultado("Resposta correta! Parabéns!");
      setStatus("sucesso");
      setTimeout(() => onConcluir(missao.id), 1000);
    } else {
      setResultado("Resposta incorreta. Tente novamente!");
      setStatus("erro");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <dialog
      open
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-missao"
      aria-describedby="descricao-missao"
    >
      <h2 id="titulo-missao">{missao.titulo}</h2>
      <p id="descricao-missao">{missao.descricao}</p>

      <label htmlFor="resposta" className="sr-only">
        Digite sua resposta
      </label>
      <input
        ref={inputRef}
        className="caixaTexto"
        id="resposta"
        type="text"
        placeholder="Digite sua resposta..."
        value={resposta}
        onChange={(e) => setResposta(e.target.value)}
        required
        aria-required="true"
      />

      <div className="modal-botoes">
        <button
          onClick={verificarResposta}
          aria-label="Enviar resposta da missão"
        >
          Enviar
        </button>
        <button
          onClick={onClose}
          aria-label="Fechar janela de missão"
          ref={closeButtonRef}
          title="Fechar missão"
        >
          Fechar
        </button>
      </div>

      {resultado && (
        <div
          className="resultado"
          role={status === "alerta" ? "alert" : "status"}
          aria-live="polite"
        >
          <p>{resultado}</p>
          {status === "sucesso" && (
            <img
              src={sucesso}
              alt="Missão concluída com sucesso"
              width="100"
            />
          )}
          {status === "erro" && (
            <img
              src={erro}
              alt="Resposta incorreta, tente novamente"
              width="100"
            />
          )}
        </div>
      )}
    </dialog>
  );
}
