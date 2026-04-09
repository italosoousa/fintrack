import { useState } from "react";
import Dashboard from "./components/Dashboard.jsx";
import Lancamentos from "./components/Lancamentos.jsx";
import GastosFixos from "./components/GastosFixos.jsx";

const mesAtual = () => {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
};

const ABAS = [
  { id: "dashboard",    label: "Dashboard" },
  { id: "lancamentos",  label: "Lançamentos" },
  { id: "gastos-fixos", label: "Gastos Fixos" },
];

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    color: "#fff",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    height: "64px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: "700",
    whiteSpace: "nowrap",
    letterSpacing: "-0.5px",
  },
  nav: {
    display: "flex",
    gap: "0.25rem",
    flex: 1,
  },
  navBtn: {
    padding: "0.4rem 1.2rem",
    border: "none",
    borderRadius: "6px",
    background: "transparent",
    color: "rgba(255,255,255,0.65)",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "all 0.15s",
    cursor: "pointer",
  },
  navBtnAtivo: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
  },
  navBtnFixo: {
    background: "rgba(139,92,246,0.25)",
    color: "#c4b5fd",
  },
  navBtnFixoAtivo: {
    background: "#8b5cf6",
    color: "#fff",
  },
  mesInput: {
    padding: "0.35rem 0.7rem",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "0.9rem",
    colorScheme: "dark",
  },
  main: {
    flex: 1,
    padding: "2rem",
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
  },
};

export default function App() {
  const [aba, setAba] = useState("dashboard");
  const [mes, setMes] = useState(mesAtual());

  const navStyle = (id) => {
    if (id === "gastos-fixos") {
      return aba === id
        ? { ...styles.navBtn, ...styles.navBtnFixoAtivo }
        : { ...styles.navBtn, ...styles.navBtnFixo };
    }
    return aba === id ? { ...styles.navBtn, ...styles.navBtnAtivo } : styles.navBtn;
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <span style={styles.logo}>💸 FinTrack</span>
        <nav style={styles.nav}>
          {ABAS.map(({ id, label }) => (
            <button key={id} style={navStyle(id)} onClick={() => setAba(id)}>
              {label}
            </button>
          ))}
        </nav>
        {/* Seletor de mês só aparece nas abas que dependem do mês */}
        {aba !== "gastos-fixos" && (
          <input
            type="month"
            style={styles.mesInput}
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          />
        )}
      </header>

      <main style={styles.main}>
        {aba === "dashboard"    && <Dashboard mes={mes} />}
        {aba === "lancamentos"  && <Lancamentos mes={mes} />}
        {aba === "gastos-fixos" && <GastosFixos />}
      </main>
    </div>
  );
}
