import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CadTarefa } from '../Paginas/CadTarefa';
import axios from 'axios';

vi.mock('axios');
vi.spyOn(window, 'alert').mockImplementation(() => {});

describe("Cadastro de tarefas", () => {

  const usuariosMock = [{ id: 1, nome: "Usuário Teste" }];

  beforeEach(async () => {
    axios.get.mockResolvedValueOnce({ data: usuariosMock });
    render(<CadTarefa />);

    // Espera que os usuários sejam carregados no select
    await waitFor(() => {
      expect(screen.getByText("Usuário Teste")).toBeTruthy();
    });
  });

  it("deve exibir todos os campos", () => {
    expect(screen.getByLabelText(/Nome da tarefa/i)).toBeTruthy();
    expect(screen.getByLabelText(/Descrição/i)).toBeTruthy();
    expect(screen.getByLabelText(/Setor/i)).toBeTruthy();
    expect(screen.getByLabelText(/Prioridade/i)).toBeTruthy();
    expect(screen.getByLabelText(/Status/i)).toBeTruthy();
    expect(screen.getByLabelText(/Usuário/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Cadastrar Tarefa/i })).toBeTruthy();
  });
test("deve mostrar erros quando campos estiverem vazios", async () => {
  // Mock para lista de usuários
  axios.get.mockResolvedValue({
    data: [{ id: 1, nome: "Usuário Teste" }],
  });

  render(<CadTarefa />);

  // Pega todos os botões com o texto 'Cadastrar Tarefa'
  const buttons = screen.getAllByRole("button", { name: /Cadastrar Tarefa/i });

  // Clica no primeiro botão (nosso formulário principal)
  fireEvent.click(buttons[0]);

  // Aguarda os erros aparecerem
  await waitFor(() => {
    expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeTruthy();
    expect(screen.getByText(/Insira no minimo 10 caracteres/i)).toBeTruthy();
    expect(screen.getByText(/Informe o nome do setor/i)).toBeTruthy();
    expect(screen.getByText(/Selecione um usuário/i)).toBeTruthy();
  });
});

  it("deve remover caracteres inválidos do nome do setor", () => {
    const setorInput = screen.getByLabelText(/Setor/i);
    fireEvent.input(setorInput, { target: { value: "Setor123!@#" } });
    expect(setorInput.value).toBe("Setor");
  });

  it("deve limitar nome da tarefa a 30 caracteres", () => {
    const nomeInput = screen.getByLabelText(/Nome da tarefa/i);
    fireEvent.input(nomeInput, { target: { value: "A".repeat(50) } });
    expect(nomeInput.value.length).toBe(30);
  });

  it("deve enviar dados corretamente ao backend", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    fireEvent.input(screen.getByLabelText(/Nome da tarefa/i), { target: { value: "Tarefa Teste" } });
    fireEvent.input(screen.getByLabelText(/Descrição/i), { target: { value: "Descrição válida com mais de 10 caracteres" } });
    fireEvent.input(screen.getByLabelText(/Setor/i), { target: { value: "Financeiro" } });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: "M" } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: 1 } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/tarefa/",
        {
          nome: "Tarefa Teste",
          descricao: "Descrição válida com mais de 10 caracteres",
          nomeSetor: "Financeiro",
          prioridade: "M",
          status: "A",
          usuario_id: 1
        }
      );
    });
  });

  it("mostra alert de erro se a submissão falhar", async () => {
    axios.post.mockRejectedValueOnce(new Error("Falha"));

    fireEvent.input(screen.getByLabelText(/Nome da tarefa/i), { target: { value: "Tarefa Teste" } });
    fireEvent.input(screen.getByLabelText(/Descrição/i), { target: { value: "Descrição válida com mais de 10 caracteres" } });
    fireEvent.input(screen.getByLabelText(/Setor/i), { target: { value: "Financeiro" } });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: "M" } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: 1 } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Tarefa/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Éeee, não rolou, na proxima talvez");
    });
  });

});
