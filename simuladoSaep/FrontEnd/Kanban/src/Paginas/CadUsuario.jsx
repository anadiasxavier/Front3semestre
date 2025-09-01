import axios from 'axios'; //é o hook que faz a comunicação com a internet (Http)
// são hooks que permite a validação de interação com o usuário... NUNCA DUVIDE DA CAPACIDADE DO USUÁRIO
// React é comum ver o zod
import { useForm } from 'react-hook-form'; // Hook (use) aqui permite a validação de formulario
import { z } from 'zod'; // zod é uma descrição de como eu validar, quais seriam as regras
import { zodResolver } from '@hookform/resolvers/zod'; // é o que liga o hook form com o zod

//validação de formulário -- estou usando as regras do zod, que pode ser consultada na web
const schemaCadUsuario = z.object({
    nome: z.string()
        .min(1, 'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres')
        .regex(
        /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
        "Digite nome completo (nome e sobrenome), sem números ou símbolos, sem espaços no início/fim"
        ),
    email: z.string()
        .min(1, 'Insira seu email')
        .max(30, 'Insira um endereço de email com até 30 carateres')
        .email("Formato de email invalido")
        .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Formato de email inválido"
        ),

})


export function CadUsuario() {

    const {
        register, //registra para mim o que o usuário faz
        handleSubmit, //no momento em que ele der uma submit (botão)
        formState: { errors }, //no formulario, se der ruim guarda os erros na variavel errors
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(schemaCadUsuario),
        mode: "onChange",
    });

      // Tratamento para o campo nome (apenas para prevenir entrada inválida antes do submit)
    const handleNomeChange = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, ""); // só letras e espaço
        valor = valor.replace(/\s{2,}/g, " "); // evita espaços duplos
        if (valor.length > 30) valor = valor.slice(0, 30); // máximo 30 chars
        setValue("nome", valor);
    };

    // Tratamento para o campo email
    const handleEmailChange = (e) => {
        let valor = e.target.value.trim();
        if (valor.length > 50) valor = valor.slice(0, 50); // máximo 50 chars
        setValue("email", valor);
    };
    
    async function obterdados(data) {
        console.log('dados informados pelo user:', data)

        //Para grande parte das interações com outra plataforma é necessário usar o try
        try {
            await axios.post("http://127.0.0.1:8000/api/usuario/", data);
            alert("USuário cadastrado com sucesso");
            reset(); //limpo o formulário depois do cadastro
        } catch (error) { //se der ruim, aparece a mensagem de erro
            alert("Éeee, não rolou, na proxima talvez")
            console.log("Erros", error)
        }
    }
    return (
        <form className="formularios" onSubmit={handleSubmit(obterdados)}>
            <h2>Cadastro do Usuário</h2>

            <label>Nome:</label>
            <input type='text' placeholder='Jose da Silva' {...register("nome")}  onChange={handleNomeChange} />
             
            {/* Aqui eu vejo a variavel errors no campo nome e exibo a mensagem para o usuário */}
            {errors.nome && <p>{errors.nome.message}</p>}

            <label>E-mail</label>
            <input type='email' placeholder='email@email.com'  {...register("email")}  onChange={handleEmailChange}/>
            {/* Aqui eu vejo a variavel errors no campo nome e exibo a mensagem para o usuário */}
            {errors.email && <p>{errors.email.message}</p>}

            <button type='submit'>Cadastrar</button>

        </form>
    )
}
