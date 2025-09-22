import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // se estiver criando o schema aqui
import axios from 'axios';

const schemaEditarTarefas = z.object({
    prioridade: z.enum(['Baixa', 'Média', 'Alta'], {
        required_error: 'Selecione uma prioridade válida',
    }),
    status: z.enum(['A fazer', 'Fazendo', 'Pronto'], {
        required_error: 'Selecione um status válido',
    }),
});

export function EditarTarefa(){
    const { id } = useParams();
    const [tarefa, setTarefa] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: zodResolver(schemaEditarTarefas) });

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
        <section>
            <h2>Editar Tarefa</h2>
            <form className="formularios"onSubmit={handleSubmit(salvarEdicao)}>
                <label>Descrição:</label>
                <textarea value={tarefa.descricao} readOnly />

                <label>Setor:</label>
                <input type="text" value={tarefa.nomeSetor} readOnly />

                <label>Prioridade:</label>
                <select {...register('prioridade')}>
                    <option value="">Selecione</option>
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                </select>
                {errors.prioridade && <p>{errors.prioridade.message}</p>}

                <label>Status:</label>
                <select {...register('status')}>
                    <option value="A fazer">A fazer</option>
                    <option value="Fazendo">Fazendo</option>
                    <option value="Pronto">Pronto</option>
                </select>
                {errors.status && <p>{errors.status.message}</p>}

                <button type="submit">Editar</button>
            </form>
        </section>
    );
}
