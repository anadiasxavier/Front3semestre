import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

//validação de formulário
const schemaCadUsuario = z.object({
    nome: z.string()
        .min(1, 'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres'),
    email: z.string()
        .min(1, 'Insira seu email')
        .max(30, 'Insira um endereço de email com até 30 carateres')
        .email("Formato de email invalido"),
})


export function CadUsuario() {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(schemaCadUsuario)
    });
    
    async function obterdados(data) {
        console.log('dados informados pelo user:', data)

        try {
            await axios.post("http://127.0.0.1:8000/usuario/", data);
            alert("USuário cadastrado com sucesso");
            reset();
        } catch (error) {
            alert("Éeee, não rolou, na proxima talvez")
            console.log("Erros", error)
        }
    }
    return (
        <form className="formularios">
            <h2>Cadastro do Usuário</h2>

            <label>Nome:</label>
            <input type='text' placeholder='Jose da Silva' required />

            <label>E-mail</label>
            <input type='email' placeholder='email@email.com' required />

            <button type='submit'>Cadastrar</button>

        </form>
    )
}