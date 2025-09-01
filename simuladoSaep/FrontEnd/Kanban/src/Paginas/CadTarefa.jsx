import axios from 'axios'; //é o hook que faz a comunicação com a internet (Http)
// são hooks que permite a validação de interação com o usuário... NUNCA DUVIDE DA CAPACIDADE DO USUÁRIO
// React é comum ver o zod
import { useForm } from 'react-hook-form'; // Hook (use) aqui permite a validação de formulario
import { z } from 'zod'; // zod é uma descrição de como eu validar, quais seriam as regras
import { zodResolver } from '@hookform/resolvers/zod'; // é o que liga o hook form com o zod
import { useState, useEffect } from 'react';

//validação de formulário -- estou usando as regras do zod, que pode ser consultada na web
const schemaCadTarefa = z.object({
    nome: z.string()
        .trim()
        .min(1, 'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres'),
    descricao: z.string()
        .trim()
        .min(10, 'Insira no minimo caracteres na descrição ')
        .max(255, 'Insira uma escrição com até 255 carateres'),
    nomeSetor: z.string()
        .trim()
        .min(1, 'Informe o nome do setor')
        .max(100, 'Insira um com nome do setor até 100 carateres')
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/, 'o nome do setor não pode conter números ou símbolos'),
    prioridade: z.enum(['B', 'M', 'A']),
    status: z.enum(['A', 'F', 'P']),
    usuario: z.string().trim().min(1, "Escolha um usuário."),
        

})


export function CadTarefa() {

    const [usuarios, setUsuarios] = useState([]);


    const {
        register, //registra para mim o que o usuário faz
        handleSubmit, //no momento em que ele der uma submit (botão)
        formState: { errors }, //no formulario, se der ruim guarda os erros na variavel errors
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(schemaCadTarefa),
        mode: "onChange",
        defaultValues: {
            status: "A", 
        },
    });

        // setor
        const handleSetorChange = (e) => {
            let valor = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, '');
            setValue('nomeSetor', valor, { shouldValidate: true }); // validação em tempo real
        };
        // busca usuario
      useEffect(() => {
        async function fetchUsuarios() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/usuario/');
                setUsuarios(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        }
        fetchUsuarios();
    }, []);

  
    async function criarTarefa(data) {
        console.log('dados informados pelo user:', data)

        //Para grande parte das interações com outra plataforma é necessário usar o try
        try {
            await axios.post("http://127.0.0.1:8000/api/tarefa/", data);
            alert("Tarefa cadastrado com sucesso");
            reset(); //limpo o formulário depois do cadastro
        } catch (error) { //se der ruim, aparece a mensagem de erro
            alert("Éeee, não rolou, na proxima talvez")
            console.log("Erros", error)
        }
    }
    return (
        <form className="formularios" onSubmit={handleSubmit(criarTarefa)}>
            <h2>Cadastro de tarefas</h2>

            <label>Nome da tarefa:</label>
            <input type='text' placeholder='Digite o nome da tarefa aqui: ' {...register("nome")} />
            {/* Aqui eu vejo a variavel errors no campo nome e exibo a mensagem para o usuário */}
            {errors.nome && <p>{errors.nome.message}</p>}

            <label>Descrição:</label>
            <textarea  placeholder='Digite sua descrição aqui: '  {...register("descricao")} />
            {/* Aqui eu vejo a variavel errors no campo nome e exibo a mensagem para o usuário */}
            {errors.descricao && <p>{errors.descricao.message}</p>}

            <label>Setor:</label>
            <input type='text' placeholder='Digite seu setor aqui: '  {...register("nomeSetor")} onChange={handleSetorChange} />
            {/* Aqui eu vejo a variavel errors no campo nome e exibo a mensagem para o usuário */}
            {errors.nomeSetor && <p>{errors.nomeSetor.message}</p>}

            <label>Prioridade:</label>
            <select  placeholder='Escolha sua prioridade: '  {...register("prioridade")}>
            {/* Aqui eu vejo a variavel errors no campo nome e exibo a mensagem para o usuário */}
                <option value="B">Baixa</option>
                <option value="M">Média</option>
                <option value="A">Alta</option>
            </select>
            {errors.prioridade && <p>{errors.prioridade.message}</p>}

            <label>Status::</label>
            <select  placeholder='Escolha seu status: ' {...register("status")}>
            {/* Aqui eu vejo a variavel errors no campo nome e exibo a mensagem para o usuário */}
                <option value="A">A fazer</option>
                {/* <option value="F">Fazendo</option>
                <option value="P">Pronto</option> */}
            </select>
            {errors.status && <p>{errors.status.message}</p>}

            <label>Usuário:</label>
            <select {...register('usuario')}>
                <option value="">Selecione um usuário</option>
                {usuarios.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.nome}
                    </option>
                ))}
            </select>
            {errors.usuario && <p>{errors.usuario.message}</p>}

            <button type='submit'>Cadastrar Tarefa</button>

        </form>
    );
}
