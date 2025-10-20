export function MissaoCard({ missao, onIniciarMissao, concluida }) {
  return (
    <article className="missao-card">
      <h3>{missao.titulo}</h3>
      <p>{missao.missao}</p>

      <button
        onClick={() => onIniciarMissao(missao)}
        disabled={concluida}
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
