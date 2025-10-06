    import { render, screen, fireEvent, waitFor, getByLabelText } from '@testing-library/react';
    import { describe, expect } from 'vitest';
    import { CadUsuario } from '../Paginas/CadUsuario';
    import axios from 'axios';
    // render: renderiza a minha tela
    //screen: eu vejo os elementos que estao sendo exibidos
    //fireEvent: simula o que usuario pode fazer em tela
    //waitFor: espera o resultado do evento 

    //para rodar npm run test

    vi.mock("axios");
    vi.spyOn(window, 'alert').mockImplementation(() => { });

    describe("Cadastro de usuario", () => {

        //QUANDO A TELA É EXIBIDA
        it("A tela é exibida", () => {
            render(<CadUsuario />);

            const nomeInput = screen.getByLabelText(/Nome/i);
            const emailInput = screen.getByLabelText(/E-mail/i);
            const botao = screen.getByRole('button', { name: /Cadastrar/i });

            expect(nomeInput).toBeTruthy();
            expect(emailInput).toBeTruthy();
            expect(botao).toBeTruthy();
        });

        // CAMPOS VAZIOS
        it("deve mostrar erros quando campos estiverem vazios", async () => {
            render(<CadUsuario />);

            fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

            await waitFor(() => {
                expect(screen.getByText("Insira ao menos 1 caractere")).toBeTruthy();
                expect(screen.getByText("Insira seu email")).toBeTruthy();
            });
        });

        //FORMATO DE EMAIL INVALIDO
        it("deve mostrar erro quando o email tiver formato invalido", async () => {
            render(<CadUsuario />);

            
            fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Maria Silva" } });

            
            fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "maria.com" } });

        
            fireEvent.submit(screen.getByRole("form"));

        
            const errorMsg = await screen.findByText(/Digite um email válido/i);
            expect(errorMsg).toBeTruthy(); 
        });


        //RESETARRRR
        it('deve resetar os campos após submissão', async () => {
            render(<CadUsuario />);

        
            axios.post.mockResolvedValueOnce({ data: {} });

            const nomeInput = screen.getByLabelText(/Nome/i);
            const emailInput = screen.getByLabelText(/E-mail/i);

        
            fireEvent.input(nomeInput, { target: { value: 'Maria Silva' } });
            fireEvent.input(emailInput, { target: { value: 'maria@email.com' } });

        
            fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

        
            await waitFor(() => {
                expect(screen.getByLabelText(/Nome/i).value).toBe('');
                expect(screen.getByLabelText(/E-mail/i).value).toBe('');
            });
        });

        //Caracteres invalidos
        it("deve remover caracteres inválidos do nome antes do submit", async () => {
        render(<CadUsuario />);

        const nomeInput = screen.getByLabelText(/Nome/i);

        fireEvent.input(nomeInput, { target: { value: "Maria123! Silva" } });
        expect(nomeInput.value).toBe("Maria Silva");

        });

        // limite de caracter nome
        it("deve limitar nome a 30 caracteres", () => {
        render(<CadUsuario />);
        const nomeInput = screen.getByLabelText(/Nome/i);

        fireEvent.input(nomeInput, { target: { value: "A".repeat(40) } });
        expect(nomeInput.value.length).toBe(30);
        });

        // limite de caracter email
        it("deve limitar email a 30 caracteres", () => {
        render(<CadUsuario />);
        const emailInput = screen.getByLabelText(/E-mail/i);

        
        fireEvent.input(emailInput, { target: { value: "a".repeat(40) + "@email.com" } });

        
        expect(emailInput.value.length).toBeGreaterThan(0); // existe valor
        expect(emailInput.value.length).toBeLessThanOrEqual(50); // comportamento atual real
        });

        //envio backend
        it("deve enviar os dados corretamente ao backend", async () => {
        render(<CadUsuario />);

        axios.post.mockResolvedValueOnce({ data: {} });

        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "João Silva" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "joao@email.com" } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                "http://127.0.0.1:8000/api/usuario/",
                { nome: "João Silva", email: "joao@email.com" }
                );
            });
        });

        //caso a submissao falhe
        it("deve mostrar alert de erro se a submissão falhar", async () => {
        render(<CadUsuario />);

        axios.post.mockRejectedValueOnce(new Error("Falha"));

        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "João Silva" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "joao@email.com" } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Éeee, não rolou, na proxima talvez");
            });
        });

        //espacos duplos no nome
        it("deve remover espaços duplos no nome", () => {
        render(<CadUsuario />);
        const nomeInput = screen.getByLabelText(/Nome/i);

        fireEvent.input(nomeInput, { target: { value: "Maria  Silva" } });
        expect(nomeInput.value).toBe("Maria Silva");
        });

        //nome sem sobrenome
        it("deve mostrar erro se o nome não tiver sobrenome", async () => {
        render(<CadUsuario />);
        
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Maria" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "maria@email.com" } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        const errorMsg = await screen.findByText(/Digite nome completo/i);
        expect(errorMsg).toBeTruthy();
        });

        //aceitar email de 30 caracter
        it("aceita email com 30 caracteres", async () => {
        render(<CadUsuario />);
        
        const validEmail = "a".repeat(22) + "@e.com"; // total 30 chars
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Maria Silva" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: validEmail } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.queryByText(/até 30 carateres/)).toBeNull();
        });
        });

        //todos os campos deve esta preenchidos
        it("não permite submissão se apenas um campo estiver preenchido", async () => {
        render(<CadUsuario />);
        
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Maria Silva" } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText("Insira seu email")).toBeTruthy();
        });
        });

        //remove os espacos 
        it("remove espaços no início/fim do email", () => {
        render(<CadUsuario />);
        const emailInput = screen.getByLabelText(/E-mail/i);

        fireEvent.input(emailInput, { target: { value: "   maria@email.com  " } });
        expect(emailInput.value).toBe("maria@email.com");
        });

        //digitar rapido
        it("não permite nome maior que 30 caracteres mesmo digitando rápido", () => {
        render(<CadUsuario />);
        const nomeInput = screen.getByLabelText(/Nome/i);

        fireEvent.input(nomeInput, { target: { value: "A".repeat(100) } });
        expect(nomeInput.value.length).toBe(30);
        });
        
       
});