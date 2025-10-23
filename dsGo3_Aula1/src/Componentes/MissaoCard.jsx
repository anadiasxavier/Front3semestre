export function MissaoCard({ missao, onIniciarMissao, concluida }) {
  const tituloId = `titulo-missao-${missao.id}`;
  const descricaoId = `descricao-missao-${missao.id}`;

  return (
    <article
      className="missao-card"
      role="listitem"
      aria-labelledby={tituloId}
      aria-describedby={descricaoId}
    >
      <h3 id={tituloId}>{missao.titulo}</h3>
      <p id={descricaoId}>{missao.missao}</p>

      <button
        onClick={() => onIniciarMissao(missao)}
        disabled={concluida}
        aria-pressed={concluida}
        aria-label={
          concluida
            ? `Missão ${missao.titulo} já concluída`
            : `Iniciar missão ${missao.titulo}`
        }
      >
        {concluida ? "Missão concluída" : "Iniciar Missão"}
      </button>
    </article>
  );
}
