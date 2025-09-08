import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Tarefa({ tarefa }){

    const [status, setStatus] = useState(tarefa.status || "");
    const navigate = useNavigate();

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
    return(
        <article>
            <h3 id={`tarefa: ${tarefa.id}`}>{tarefa.descricao}</h3>
            <dl>
                <dt>Setor:</dt>
                <dd>{tarefa.nomeSetor}</dd>
                <dt>Prioridade:</dt>
                <dd>{tarefa.prioridade}</dd>               
            </dl>

            <button onClick={()=> navigate(`/editarTarefa/${tarefa.id}`)}>Editar</button>
            <button onClick={()=> exclusaoTarefa(tarefa.id)}>Excluir</button>
            <form >
                <label>Status:</label>
                {/* //se houver mudança no campo status isso é um evento
                //esse evento é armazenando no state de status */}
                
                <select
                name="status"
                id={tarefa.id}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                >
                <option value="">Selecione</option>
                <option value="A">A fazer</option>
                <option value="F">Fazendo</option>
                <option value="P">Pronto</option>
                </select>
                <button type="button" onClick={alterarStatus}>Alterar Status</button>
            </form>
        </article>
    )
}