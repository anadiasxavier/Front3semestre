import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//fazendo o uso do Drag
import { useDraggable } from '@dnd-kit/core'; //usando a biblioteca de arrastar

export function Tarefa({ tarefa }){

    const [status, setStatus] = useState(tarefa.status || "");
    const navigate = useNavigate();

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id:tarefa.id,
    });

    const style =  transform
        //pega os pontos cartesinos X e Y para dar a sensação de arrasto para o usuario
        ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
    //fazendo a exclusao de uma tarefa 
    //async é pq eu nao sei exatamente o tempo de resposta
    // as funções devee ter nome que remeta a sua funcionalidade

    async function exclusaoTarefa(id) {
        if(confirm("Tem certeza mesmo que quer excluir?")){
            try{
                await axios.delete(`http://127.0.0.1:8000/api/tarefa/${id}/`);
                alert("Tarefa excluida com sucesso");
                window.location.reload(); //refrash
                } catch(error){
                    console.error("Erro ao excluir a tarefa", error);
                    alert("Erro ao excluir");
                }
        }
    }

    async function alterarStatus() {                    
        try{
            await axios.patch(`http://127.0.0.1:8000/api/tarefa/${tarefa.id}/`, {
            status: status,
        });
            alert("Tarefa alterada com sucesso!!!")
            window.location.reload(); //atualiza a pagina
        }catch(error){
            console.error("erro ao alterar status da tarefa", error);
            alert("Houve um erro na aleração de status");
        }
    }

    function traduzPrioridade(codigo) {
    switch (codigo) {
        case "A": return "Alto";
        case "M": return "Médio";
        case "B": return "Baixo";
        default: return "Desconhecida";
    }
    }

    return(
       <article className="tarefa" ref={setNodeRef} style={style} {...listeners} {...attributes}  >
            <h3 id={`tarefa-nome-${tarefa.id}`}>{tarefa.nome}</h3>
            <h4 id={`tarefa-descricao-${tarefa.id}`}>{tarefa.descricao}</h4>
            <dl>
                <dt>Responsável:</dt>
                <dd>{tarefa.usuario.nome}</dd>
                <dt>Setor:</dt>
                <dd>{tarefa.nomeSetor}</dd>
                <dt>Prioridade:</dt>
                <dd>{traduzPrioridade(tarefa.prioridade)}</dd>   
            </dl>

            <button onClick={()=> navigate(`/editarTarefa/${tarefa.id}`)}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label={`Editar tarefa: ${tarefa.nome}`}>Editar</button>
            <button onClick={()=> exclusaoTarefa(tarefa.id)}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label={`Excluir tarefa: ${tarefa.nome}`}>Excluir</button>

            <form >
                <label htmlFor={`status-select-${tarefa.id}`}>Status:</label>
                {/* //se houver mudança no campo status isso é um evento
                //esse evento é armazenando no state de status */}
                
                <select name="status" id={`status-select-${tarefa.id}`}
                value={status} onChange={(e) => setStatus(e.target.value)}>

                <option value="">Selecione</option>
                <option value="A">A fazer</option>
                <option value="F">Fazendo</option>
                <option value="P">Pronto</option>
                </select>

                <button type="button" onClick={alterarStatus}
                 onPointerDown={(e) => e.stopPropagation()}
                 aria-label={`Alterar status da tarefa: ${tarefa.descricao}`}>Alterar Status</button>
            </form>
        </article>
    )
}

