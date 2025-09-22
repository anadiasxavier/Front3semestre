import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Coluna } from "./Coluna";
import {DndContext} from '@dnd-kit/core'; //é o uso da biblioteca de clicar e arrastar

export function Quadro() {
    const [tarefas, setTarefas] = useState([]);

    // o effect é um hook que permite a renderizaçãode alfuma coisa na tela 
    //ele é o fofoqueiro do react, conta para todo mundo o que state está armazenando
    //effect é composto de parametros . script(algoritmo) e depois as dependencias

    useEffect(() => {
        //construo uma variavel com endereço da api
        const apiURL = 'http://127.0.0.1:8000/api/tarefa/';
        // axios permite a hamada do endereço
        axios.get(apiURL)
            //se a resposta der bom
            .then(response => { setTarefas(response.data) })
                
            //se a resposta der ruim
            .catch(error => { console.error("Erro ao carregar tarefas", error) });
    }, []);
    
    function handleDragEnd(event){
        const { active, over } = event;
        

        if (over && active){
            const tarefaId = active.id; //quero pegar o ID da tarefa que ta sofrendo o event
            const novaColuna = over.id; //quero pegar a coluna da tarefa
            setTarefas(prev =>
                prev.map(tarefa => tarefaId === tarefa.id? { ...tarefa, status: novaColuna }: tarefa)
            );

            //Atualiza o status do card (muda a situação do card {a fazer/ fazendo / pronto})
            axios.patch(`http://127.0.0.1:8000/api/tarefa/${tarefaId}/`, {
                status: novaColuna
            })
            .catch(err => console.error("Erro ao atualizar status: ", err));
        }
    }

    // criacao de arrays com os stats possiveis no kanban
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === "A");
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === "F");
    const tarefasPronto = tarefas.filter(tarefa => tarefa.status === "P");



    return (
        <DndContext onDragEnd={handleDragEnd}>
            <main className="conteiner" aria-label="quadro de tarefas">
                <h1>Meu quadro</h1>
                 <section className="atividades" aria-label="Colunas de tarefas">
                    <Coluna id = 'A' titulo="A fazer" tarefas={tarefasAfazer} />
                    <Coluna id = 'F' titulo="Fazendo" tarefas={tarefasFazendo} />
                    <Coluna id = 'P' titulo="Pronto" tarefas={tarefasPronto} />
                </section>
            </main>
        </DndContext>
    );
}