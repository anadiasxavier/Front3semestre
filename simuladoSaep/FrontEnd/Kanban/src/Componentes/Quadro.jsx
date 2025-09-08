import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Coluna } from "./Coluna";

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
            .catch(error => { console.error("Deu ruim hein", error) });
    }, [])
    //
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === "A");
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === "F");
    const tarefasPronto = tarefas.filter(tarefa => tarefa.status === "P");



    return (
        <main className="conteiner">
            <h1>Meu quadro</h1>
            <Coluna titulo="A fazer" tarefas={tarefasAfazer} />
            <Coluna titulo="Fazendo" tarefas={tarefasFazendo} />
            <Coluna titulo="Pronto" tarefas={tarefasPronto} />
        </main>
    );
}