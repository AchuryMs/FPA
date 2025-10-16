import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import BuyPage from "./pages/BuyPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu" element={<DashboardPage />} />
        <Route path="/menuold" element={<MenuPage />} />
        <Route path="/buy" element={<BuyPage />} />
      </Routes>
    </BrowserRouter>
  );
}