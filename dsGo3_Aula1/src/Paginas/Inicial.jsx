import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

export function Inicial() {
  //navegacao entre as paginas
    const navigate =useNavigate();

  return (
    <main className="inicial">
      <img src={logo} className="logo" alt="Logo TinkerPapel"  />
     
     {/* botao entrar */}
      <button onClick={() => navigate('/dsgo')} className='entrar'   aria-label="Entrar no jogo TinkerPapel">
        Entrar
      </button>
    </main>
  );
}
