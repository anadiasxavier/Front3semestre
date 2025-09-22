import { Tarefa } from './Tarefa';
import { useDroppable } from '@dnd-kit/core'; //Inserido os locais de soltura

export function Coluna({ id, titulo, tarefas = []}){
    //fazendo o controle do ambiente de soltura
    const { setNodeRef } = useDroppable({ id })

    return(
        <section className="coluna" aria-labelledby={`titulo-${id}`} ref={setNodeRef}>
            <h2 id={`titulo-${id}`} className="titulo">{titulo}</h2>
            {tarefas.map(tarefa =>{
                console.log("Renderizando", tarefa);
                return<Tarefa key={tarefa.id} tarefa={tarefa}/>;
            })}

        </section>
    )
} 