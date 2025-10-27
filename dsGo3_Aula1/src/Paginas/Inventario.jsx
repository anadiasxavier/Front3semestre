import { useEffect, useState } from "react";

export function Inventario() {
  // armazena as figurinhas 
  const [figurinhas, setFigurinhas] = useState([]);

  useEffect(() => {
    const armazenado = JSON.parse(localStorage.getItem("inventario")) || [];
    setFigurinhas(armazenado);
  }, []);

  //limpa o inventario
  const limparInventario = () => {
    if (!window.confirm("Deseja realmente limpar o inventário?")) return;

    localStorage.removeItem("inventario");
    setFigurinhas([]);
  };

  return (
    <main className="conteiner">
      <section className="inventario" aria-labelledby="titulo-inventario">
        <h2 id="titulo-inventario">Inventário</h2>
        
        {/* limpa todas as figurinhas */}
        <button
          className="limpar-inventario"
          onClick={limparInventario}
          aria-label="Limpar todas as figurinhas do inventário"
        >
          Limpar Inventário
        </button>

        {/* mensagem vazio ou lista de figurinhas */}
        {figurinhas.length === 0 ? (
          <p className="vazio">Nenhuma figurinha coletada ainda!</p>
        ) : (
          <ul className="grid" role="list">
            {figurinhas.map((f) => (
              <li key={f.id} className="figurinha">
                <img src={f.imagem} alt={f.nome} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
