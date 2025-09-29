import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // se estiver criando o schema aqui
import axios from 'axios';

//validação com zod
const schemaEditarTarefas = z.object({
    prioridade: z.enum(['Baixa', 'Média', 'Alta'], {
        required_error: 'Selecione uma prioridade válida',
    }),
    status: z.enum(['A fazer', 'Fazendo', 'Pronto'], {
        required_error: 'Selecione um status válido',
    }),
});

export function EditarTarefa(){
    const { id } = useParams(); //pega o id
    const [tarefa, setTarefa] = useState(null); //estado que guarda a tarefa

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: zodResolver(schemaEditarTarefas) });

    //busca os dados da tarefa
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/tarefa/${id}/`)
            .then((res) => {
                const data = res.data;
                setTarefa(data);
                reset({
                    prioridade: data.prioridade === 'B' ? 'Baixa' : data.prioridade === 'M' ? 'Média' : 'Alta',
                    status: data.status === 'A' ? 'A fazer' : data.status === 'F' ? 'Fazendo' : 'Pronto'
                });
            })
            .catch((err) => console.error("Erro ao buscar tarefa", err));
    }, [id, reset]);

    //envia a edição
    async function salvarEdicao(data) {
        const payload = {
            prioridade: data.prioridade === 'Baixa' ? 'B' : data.prioridade === 'Média' ? 'M' : 'A',
            status: data.status === 'A fazer' ? 'A' : data.status === 'Fazendo' ? 'F' : 'P',
        };
        try {
            await axios.patch(`http://127.0.0.1:8000/api/tarefa/${id}/`, payload);
            alert("Tarefa editada com sucesso");
        } catch (err) {
            console.error("Deu ruim", err);
            alert("Houve um erro ao editar a tarefa");
        }
    }

    if (!tarefa) return <p>Carregando...</p>;

    return (
    <form className="formularios" onSubmit={handleSubmit(salvarEdicao)} noValidate>
    <label htmlFor="nome">Nome da Tarefa:</label>
    <input id="nome" value={tarefa.nome} readOnly aria-readonly="true" />

    <label htmlFor="descricao">Descrição:</label>
    <textarea id="descricao" value={tarefa.descricao} readOnly aria-readonly="true" />

    <label htmlFor="nomeSetor">Setor:</label>
    <input type="text" id="nomeSetor" value={tarefa.nomeSetor} readOnly aria-readonly="true" />

    <label htmlFor="prioridade">Prioridade:</label>
    <select
        id="prioridade"
        {...register('prioridade')}
        aria-invalid={errors.prioridade ? "true" : "false"}
        aria-describedby={errors.prioridade ? "prioridade-error" : undefined}
    >
        <option value="">Selecione</option>
        <option value="Baixa">Baixa</option>
        <option value="Média">Média</option>
        <option value="Alta">Alta</option>
    </select>
    {errors.prioridade && <p id="prioridade-error" className="errors">{errors.prioridade.message}</p>}

    <label htmlFor="status">Status:</label>
    <select
        id="status"
        {...register('status')}
        aria-invalid={errors.status ? "true" : "false"}
        aria-describedby={errors.status ? "status-error" : undefined}
    >
        <option value="A fazer">A fazer</option>
        <option value="Fazendo">Fazendo</option>
        <option value="Pronto">Pronto</option>
    </select>
    {errors.status && <p id="status-error" className="errors">{errors.status.message}</p>}

    <button type="submit">Editar</button>
</form>
    );
}
