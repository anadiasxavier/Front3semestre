export function MissaoCard({ missao, onIniciarMissao, concluida }) {
  const tituloId = `titulo-missao-${missao.id}`;
  const descricaoId = `descricao-missao-${missao.id}`;

  const inventario = JSON.parse(localStorage.getItem("inventario")) || [];
  const concluidaLocal = inventario.some((f) => f.id === missao.id);
  const isConcluida = concluida !== undefined ? concluida : concluidaLocal;

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
        disabled={isConcluida}
        aria-pressed={isConcluida}
        aria-label={
          isConcluida
            ? `Missão ${missao.titulo} já concluída`
            : `Iniciar missão ${missao.titulo}`
        }
      >
        {isConcluida ? "Missão concluída" : "Iniciar missão"}
      </button>
    </article>
  );
}
