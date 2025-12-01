import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

export function Mapa() {
  const mapRef = useRef(null);
  const routingRef = useRef(null);

  const [coords, setCoords] = useState({
    lat1: "",
    lon1: "",
    lat2: "",
    lon2: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    mapRef.current = L.map("mapa").setView([-22.78, -47.14], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(mapRef.current);
  }, []);

  function validar() {
    const temp = {};
    if (!coords.lat1) temp.lat1 = "Latitude origem obrigatória";
    if (!coords.lon1) temp.lon1 = "Longitude origem obrigatória";
    if (!coords.lat2) temp.lat2 = "Latitude destino obrigatória";
    if (!coords.lon2) temp.lon2 = "Longitude destino obrigatória";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  }

  function gerarRota(e) {
    e.preventDefault();
    if (!validar()) return;

    const p1 = L.latLng(Number(coords.lat1), Number(coords.lon1));
    const p2 = L.latLng(Number(coords.lat2), Number(coords.lon2));

    if (routingRef.current) routingRef.current.remove();

    routingRef.current = L.Routing.control({
      waypoints: [p1, p2],
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      lineOptions: { styles: [{ weight: 6 }] },
    }).addTo(mapRef.current);

    mapRef.current.setView(p1, 14);
  }

  function pegarLocal() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords((c) => ({
          ...c,
          lat1: pos.coords.latitude.toFixed(6),
          lon1: pos.coords.longitude.toFixed(6),
        }));
      },
      () => alert("Permita acesso à localização"),
      { enableHighAccuracy: true }
    );
  }

  return (
    <div className="pagina-mapa">

      {/* CARD LATERAL */}
      <form className="mapa-card" onSubmit={gerarRota}>

        <h1 className="titulo-card">Gerar Rota</h1>

        {/* ORIGEM */}
        <div className="bloco">
          <h3 className="titulo-bloco">Origem</h3>

          <div className="campo">
            <label className="label">Latitude</label>
            <input
              className="input"
              type="text"
              placeholder="Latitude origem"
              value={coords.lat1}
              onChange={(e) => setCoords({ ...coords, lat1: e.target.value })}
            />
            <p className="erro">{errors.lat1}</p>
          </div>

          <div className="campo">
            <label className="label">Longitude</label>
            <input
              className="input"
              type="text"
              placeholder="Longitude origem"
              value={coords.lon1}
              onChange={(e) => setCoords({ ...coords, lon1: e.target.value })}
            />
            <p className="erro">{errors.lon1}</p>
          </div>

          <button type="button" className="btn-local" onClick={pegarLocal}>
            Usar minha localização atual
          </button>
        </div>

        {/* DESTINO */}
        <div className="bloco">
          <h3 className="titulo-bloco">Destino</h3>

          <div className="campo">
            <label className="label">Latitude</label>
            <input
              className="input"
              type="text"
              placeholder="Latitude destino"
              value={coords.lat2}
              onChange={(e) => setCoords({ ...coords, lat2: e.target.value })}
            />
            <p className="erro">{errors.lat2}</p>
          </div>

          <div className="campo">
            <label className="label">Longitude</label>
            <input
              className="input"
              type="text"
              placeholder="Longitude destino"
              value={coords.lon2}
              onChange={(e) => setCoords({ ...coords, lon2: e.target.value })}
            />
            <p className="erro">{errors.lon2}</p>
          </div>

          <button type="button" className="btn-local" onClick={pegarLocal}>
            Usar minha localização atual
          </button>
        </div>

        <button type="submit" className="btn-gerar">
          Gerar Rota
        </button>
      </form>

      {/* ÁREA DO MAPA */}
      <div className="mapa-area">
        <div id="mapa"></div>
      </div>
    </div>
  );
}
