import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header__logo" onClick={() => navigate("/")}> 
        <img src="/vite.svg" alt="Logo" style={{ height: "40px", cursor: "pointer" }} />
        <span className="header__brand">InverSite</span>
      </div>
      <nav className="header__nav">
        <button className="header__nav-btn" onClick={() => navigate("/main")}>Inicio</button>
        <button className="header__nav-btn" onClick={() => navigate("/about")}>Sobre Nosotros</button>
        <button className="header__nav-btn" onClick={() => navigate("/contact")}>Contacto</button>
        <button className="header__nav-btn" onClick={() => navigate("/login")}>Ingresar</button>
      </nav>
    </header>
  );
}