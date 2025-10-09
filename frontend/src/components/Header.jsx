// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header>
      <h2>Mi Aplicación</h2>
      <button onClick={() => navigate("/login")}>Logearse</button>
    </header>
  );
}
