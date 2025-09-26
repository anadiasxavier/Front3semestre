import { render, screen, fireEvent, waitFor, getByLabelText } from '@testing-library/react';
import { describe, expect } from 'vitest';
import { CadUsuario } from '../Paginas/CadUsuario';
// render: renderiza a minha tela
//screen: eu vejo os elementos que estao sendo exibidos
//fireEvent: simula o que usuario pode fazer em tela
//waitFor: espera o resultado do evento 

describe("Cadastro de usuario", () =>{

    it("A tela é exibida", ()=>{
        render(<CadUsuario/>);

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);
        const botao = screen.getByRole('button', { name: /Cadastrar/i });

        expect(nomeInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(botao).toBeTruthy();
        })
})