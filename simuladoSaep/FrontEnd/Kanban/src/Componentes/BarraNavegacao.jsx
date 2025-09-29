import { Link } from "react-router-dom";

//Barra de navegação principal
export function BarraNavegacao() {
  return (
    <nav className="barra" aria-label="Barra de navegação principal">
      <ul>
        <li>
          <Link to="/cadUsuario"  aria-label="ir para tela de cadastro do usuario">Cadastro de Usuário</Link>
        </li>
        <li>
          <Link to="/cadTarefa" aria-label="ir para tela de cadastro de tarefa">Cadastro de Tarefa</Link>
        </li>
        <li>
          <Link to="/"  aria-label="ir para tela de gerenciamento de tarefas">Gerenciamento de Tarefas</Link>
        </li>
      </ul>
    </nav>
  );
}
