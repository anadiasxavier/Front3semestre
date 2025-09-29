import { BarraNavegacao } from "../Componentes/BarraNavegacao"
import { Cabecalho } from "../Componentes/Cabecalho"
import { Outlet } from "react-router-dom";

//componente principal da aplicacao
export function Inicial(){
    return(
        <>
            <Cabecalho/>
            <BarraNavegacao/>
            <Outlet/>

        </>
    )
}