import { useState } from "react";
import { missoes } from '../Dados/dadosMissao';
import { MissaoCard } from '../Componentes/MissaoCard';
import { MissaoModal } from '../Componentes/MissaoModal';

export function Missao() {
  // missao selecionada
  const [missaoSelecionada, setMissaoSelecionada] = useState(null);
  const [refresh, setRefresh] = useState(0);
 

  const concluirMissao = (id) => {
    const inventario = JSON.parse(localStorage.getItem("inventario")) || [];
    const m = missoes.find((ms)=> ms.id === id);

    const figurinha  = {
      id: m.id,
      nome: m.titulo || `figurinha ${m.id}`,
      figura: m.figura || '/src/assets/sucesso.png',

    };
    
    if(!inventario.some((f) => f.id === id)){
      inventario.push(figurinha);
      localStorage.setItem("inventario", JSON.stringify(inventario));
    }

    
    setMissaoSelecionada(null);
    setRefresh((r)=> r + 1);
  };

  return (
    <section className="conteiner" aria-labelledby="titulo-missoes">
      <h2 id="titulo-missoes">Missões</h2>

      {/* lisa das missoes */}
      <div className="missoes-grid" role="list">
        {missoes.map((m) => (
          <MissaoCard
            key={`${m.id} - ${refresh}`}
            missao={m}
            onIniciarMissao={setMissaoSelecionada}
           
          />
        ))}
      </div>

        {/* abre o modal */}
      {missaoSelecionada && (
        <MissaoModal
          missao={missaoSelecionada}
          onClose={() => setMissaoSelecionada(null)}
          onConcluir={concluirMissao}
        />
      )}
    </section>
  );
}
