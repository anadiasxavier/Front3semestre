import missao from '../assets/missao.png';
import mapa from '../assets/mapa.png';
import bau from '../assets/bau.png';
import camera from '../assets/camera.png';
import { Link } from 'react-router-dom';

// menu principal
export function Menu() {
  return (
    <nav className="menu" aria-label="Menu principal">
      <ul>
        <li>
          {/* link para missoes */}
          <Link to="missao" aria-label="Ir para Missões">
            <figure>
              <img src={missao} alt="Ícone de Missões" />
              <figcaption>Missões</figcaption>
            </figure>
          </Link>
        </li>

        <li>
          {/* link para inventario */}
          <Link to="inventario" aria-label="Abrir Inventário">
            <figure>
              <img src={bau} alt="Ícone de Inventário" />
              <figcaption>Inventário</figcaption>
            </figure>
          </Link>
        </li>

        <li>
          {/* link para mapa */}
          <Link to="mapa" aria-label="Abrir GeoLocalização">
            <figure>
              <img src={mapa} alt="Ícone de GeoLocalização" />
              <figcaption>GeoLocalização</figcaption>
            </figure>
          </Link>
        </li>

        <li>
          {/* link para camera */}
          <Link to="camera" aria-label="Abrir Câmera">
            <figure>
              <img src={camera} alt="Ícone de Câmera" />
              <figcaption>Câmera</figcaption>
            </figure>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
