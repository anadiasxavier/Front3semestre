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
  
  // renderizar os campos
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

  // erros nos campos obrigatorios
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

  // limita o nome da tarefa 
  it('deve limitar o nome a 30 caracteres', async () => {
    render(<CadTarefa />);
    const nomeInput = screen.getByLabelText(/Nome da tarefa/i);

    await act(async () => {
      fireEvent.change(nomeInput, { target: { value: 'A'.repeat(50) } });
    });

    expect(nomeInput.value.length).toBe(30);
  });

  // sem caracter especial no nome setor
  it('deve remover caracteres inválidos do nome do setor', async () => {
    render(<CadTarefa />);
    const setorInput = screen.getByLabelText(/Setor/i);

    await act(async () => {
      fireEvent.change(setorInput, { target: { value: 'Setor123!@#' } });
    });

    expect(setorInput.value).toBe('Setor');
  });

  // envio backend
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

  //alerta de sucesso
  it('deve mostrar alerta de sucesso após cadastro', async () => {
    axios.post.mockResolvedValueOnce({});
    render(<CadTarefa />);

    fireEvent.change(screen.getByLabelText(/Nome da tarefa/i), { target: { value: 'Tarefa teste' } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição com mais de 10 caracteres' } });
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Tarefa cadastrado com sucesso');
    });
  });

  //valor status A
  it('deve ter o valor padrão do status como "A"', () => {
    render(<CadTarefa />);
    const statusSelect = screen.getByLabelText(/Status/i);
    expect(statusSelect.value).toBe('A');
  });

  //selecionar diferentes prioridades
  it('deve permitir selecionar diferentes prioridades', async () => {
    render(<CadTarefa />);

    const prioridadeSelect = screen.getByLabelText(/Prioridade/i);

    fireEvent.change(prioridadeSelect, { target: { value: 'A' } });
    expect(prioridadeSelect.value).toBe('A');

    fireEvent.change(prioridadeSelect, { target: { value: 'B' } });
    expect(prioridadeSelect.value).toBe('B');
  });


  //mostrar lista de usuario
  it('deve carregar e exibir a lista de usuários', async () => {
    render(<CadTarefa />);

    await waitFor(() => {
      mockUsuarios.forEach(user => {
        expect(screen.getByRole('option', { name: user.nome })).toBeInTheDocument();
      });
    });
  });

  //nao enviar caso tenha erro
  it('não deve enviar dados se houver erros de validação', async () => {
    axios.post = vi.fn();

    render(<CadTarefa />);

    
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeInTheDocument();
    });

    expect(axios.post).not.toHaveBeenCalled();
  });

  //tira a mensagem de erro quando é corrigida
  it('deve remover a mensagem de erro ao corrigir o campo', async () => {
    render(<CadTarefa />);
    const nomeInput = screen.getByLabelText(/Nome da tarefa/i);


    fireEvent.change(nomeInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeInTheDocument();
    });


    fireEvent.change(nomeInput, { target: { value: 'Novo nome' } });

    await waitFor(() => {
      expect(screen.queryByText(/Insira ao menos 1 caractere/i)).not.toBeInTheDocument();
    });
  });

  //caso o cadastro falhe
  it('deve mostrar alerta de erro se falhar o cadastro', async () => {
    axios.post = vi.fn().mockRejectedValueOnce(new Error('fail'));

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
      expect(window.alert).toHaveBeenCalledWith('Éeee, não rolou, na proxima talvez');
    });
  });

  //erro se a descricao tiver menos de 10 caracter
  it('deve mostrar erro se descrição tiver menos de 10 caracteres', async () => {
    render(<CadTarefa />);

    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'curto' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(screen.getByText(/Insira no minimo 10 caracteres/i)).toBeInTheDocument();
    });
  });

  //caso o usuario seja invalido
  it('deve mostrar erro se usuário inválido for selecionado', async () => {
    render(<CadTarefa />);

    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '999' } }); // usuário inexistente
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(screen.getByText(/Selecione o usuário/i)).toBeInTheDocument();
    });
  });

  //apenas letras e espacos no setor
  it('deve permitir somente letras e espaços no campo setor', async () => {
    render(<CadTarefa />);
    const setorInput = screen.getByLabelText(/Setor/i);

    fireEvent.change(setorInput, { target: { value: 'Setor 123!@#' } });

    expect(setorInput.value).toBe('Setor ');
  });

  //se apenas alguns campos estiverem preenchidos, nao é para enviar
  it('não deve enviar se apenas alguns campos estiverem preenchidos', async () => {
    axios.post = vi.fn();

    render(<CadTarefa />);

    fireEvent.change(screen.getByLabelText(/Nome da tarefa/i), { target: { value: 'Tarefa teste' } });
    // Descrição não preenchida
    fireEvent.change(screen.getByLabelText(/Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(screen.getByText(/Insira no minimo 10 caracteres/i)).toBeInTheDocument();
    });

    expect(axios.post).not.toHaveBeenCalled();
  });

  //chama a api de usuario
  it('deve chamar a API de usuários ao montar o componente', async () => {
    render(<CadTarefa />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/api/usuario/');
      });
  });

  //se o usuario nao for selecionado
  it('deve mostrar erro se nenhum usuário for selecionado', async () => {
    render(<CadTarefa />);

    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(screen.getByText(/Selecione o usuário/i)).toBeInTheDocument();
    });
  });

  //descricao com ate 255 letras
  it('deve aceitar uma descrição com até 255 caracteres', async () => {
    render(<CadTarefa />);
    const descricaoInput = screen.getByLabelText(/Descrição/i);

    const textoValido = 'a'.repeat(255);
    fireEvent.change(descricaoInput, { target: { value: textoValido } });

    expect(descricaoInput.value.length).toBe(255);
  });

  //o botao deve aparecer na tela
  it('deve exibir o botão de cadastro visível', () => {
    render(<CadTarefa />);
    const botao = screen.getByRole('button', { name: /Cadastrar Tarefa/i });
    expect(botao).toBeVisible();
  });

// o setor nao recebe espaco em branco
 it('não deve aceitar apenas espaços em branco no campo Setor', async () => {
    render(<CadTarefa />);
    const setorInput = screen.getByLabelText(/Setor/i);

    fireEvent.change(setorInput, { target: { value: '    ' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(screen.getByText(/Informe o nome do setor/i)).toBeInTheDocument();
    });
  });
  










});
