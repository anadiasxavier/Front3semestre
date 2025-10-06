import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import { CadTarefa } from '../Paginas/CadTarefa';
import axios from 'axios';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

vi.mock('axios');
vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('Cadastro de tarefa', () => {
  const mockUsuarios = [
    { id: 1, nome: 'Usuário Um' },
    { id: 2, nome: 'Usuário Dois' },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockUsuarios });
  });
  
  //renderizar os campos
  it('deve renderizar todos os campos corretamente', async () => {
    render(<CadTarefa />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Usuário/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Nome da tarefa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Setor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prioridade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();

    mockUsuarios.forEach(user => {
      expect(screen.getByRole('option', { name: new RegExp(user.nome, 'i') })).toBeInTheDocument();
    });
  });

  //erros nos campos obrigatorios
  it('deve mostrar erros quando campos obrigatórios estiverem vazios', async () => {
    render(<CadTarefa />);

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeInTheDocument(); 
      expect(screen.getByText(/Insira no minimo 10 caracteres/i)).toBeInTheDocument(); 
      expect(screen.getByText(/Informe o nome do setor/i)).toBeInTheDocument(); 
      expect(screen.getByText(/Selecione o usuário/i)).toBeInTheDocument(); 
    });
  });

  //limita o nome da tarefa 
  it('deve limitar o nome a 30 caracteres', async () => {
    render(<CadTarefa />);
    const nomeInput = screen.getByLabelText(/Nome da tarefa/i);

    await act(async () => {
      fireEvent.change(nomeInput, { target: { value: 'A'.repeat(50) } });
    });

    expect(nomeInput.value.length).toBe(30);
  });

  //sem caracter especial no nome setor
  it('deve remover caracteres inválidos do nome do setor', async () => {
    render(<CadTarefa />);
    const setorInput = screen.getByLabelText(/Setor/i);

    await act(async () => {
      fireEvent.change(setorInput, { target: { value: 'Setor123!@#' } });
    });

    expect(setorInput.value).toBe('Setor');
  });

  //envio backend
  it('deve submeter os dados corretamente ao backend', async () => {
    axios.post = vi.fn().mockResolvedValue({ data: { success: true } });

    render(<CadTarefa />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Usuário/i)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Nome da tarefa/i), { target: { value: 'Tarefa teste' } });
      fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição com mais de 10 caracteres' } });
      fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
      fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: 'M' } });
      fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'A' } });
    });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/tarefa/',
        expect.objectContaining({
          nome: 'Tarefa teste',
          descricao: 'Descrição com mais de 10 caracteres',
          nomeSetor: 'TI',
          usuario_id: expect.any(Number),  
          prioridade: 'M',
          status: 'A',
        })
      );
    });
  });


   it('deve mostrar alert de erro se a submissão falhar', async () => {
  axios.post.mockRejectedValueOnce(new Error('Erro na submissão'));

  render(<CadTarefa />);

  // Preencher campos obrigatórios para enviar
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Nome da tarefa/i), { target: { value: 'Tarefa teste' } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição com mais de 10 caracteres' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: 'M' } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'A' } });
  });

  fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Éeee, não rolou, na proxima talvez');
  });
});
});
