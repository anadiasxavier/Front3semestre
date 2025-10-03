import { render, screen, fireEvent, waitFor, getByLabelText } from '@testing-library/react';
import { describe, expect } from 'vitest';
import { CadUsuario } from '../Paginas/CadUsuario';
// render: renderiza a minha tela
//screen: eu vejo os elementos que estao sendo exibidos
//fireEvent: simula o que usuario pode fazer em tela
//waitFor: espera o resultado do evento 

//para rodar npm run test

describe("Cadastro de usuario", () =>{

    it("A tela é exibida", ()=>{
        render(<CadUsuario/>);

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);
        const botao = screen.getByRole('button', { name: /Cadastrar/i });

        expect(nomeInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(botao).toBeTruthy();
        });

        it("deve mostrar erros quando campos estiverem vazios", async () =>{
            render(<CadUsuario/>);

            fireEvent.click(screen.getByRole("button", {name:/Cadastrar/i}));

            await waitFor(() =>{
                expect(screen.getByText("Insira ao menos 1 caractere")).toBeTruthy();
                expect(screen.getByText("Insira seu email")).toBeTruthy();
            });
        });

        it("deve mostrar erro quando o email tiver formato inválido", async ()=>{
            render(<CadUsuario/>);

            fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Maria" } });
            fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "maria.com" }
        });

        fireEvent.submit(screen.getByRole("form") || screen.getByRole("button", {name:/Cadastrar/i}));
            await waitFor(() =>{
                expect(screen.getByText(/Formato de email invalido/i)).toBeTruthy();
            })
})