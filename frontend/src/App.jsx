import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ✅ Importar desde las nuevas rutas (según tu estructura modular)
import LoginPage from "./features/auth/Login/LoginPage.jsx";
import RegisterPage from "./features/auth/Register/RegisterPage.jsx";
import DashboardPage from "./features/dashboard/DashboardPage.jsx";
import { PrivateRoute } from "./components/PrivateRoute.jsx"; // o donde lo guardaste

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página raíz redirige al login */}
        <Route path="/" element={<LoginPage />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* Catch-all: si entra a una ruta inexistente */}
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}