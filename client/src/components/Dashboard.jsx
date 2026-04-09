import { useEffect, useState, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CORES = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const s = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1.25rem",
    marginBottom: "1.5rem",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  cardLabel: {
    fontSize: "0.78rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#6b7280",
    marginBottom: "0.5rem",
  },
  cardSub: {
    fontSize: "0.75rem",
    color: "#9ca3af",
    marginTop: "0.4rem",
  },
  cardValue: {
    fontSize: "1.75rem",
    fontWeight: "700",
    lineHeight: 1,
  },
  chartCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  chartTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#374151",
  },
  badge: {
    fontSize: "0.78rem",
    background: "#f3f4f6",
    color: "#6b7280",
    padding: "0.2rem 0.65rem",
    borderRadius: "999px",
    fontWeight: "500",
  },
  empty: {
    textAlign: "center",
    color: "#9ca3af",
    padding: "3rem",
    fontSize: "0.95rem",
  },
  erro: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
};

export default function Dashboard({ mes }) {
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setErro("");
    try {
      const res = await fetch(`/api/resumo?mes=${mes}`);
      if (!res.ok) throw new Error();
      setResumo(await res.json());
    } catch {
      setErro(
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3001"
      );
    }
  }, [mes]);

  useEffect(() => { carregar(); }, [carregar]);

  const resultado = resumo?.resultado ?? 0;
  const positivo  = resultado >= 0;

  const dadosGrafico = resumo
    ? Object.entries(resumo.despesasPorCategoria).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }))
    : [];

  return (
    <div>
      {erro && <div style={s.erro}>{erro}</div>}

      <div style={s.grid}>
        {/* Entradas */}
        <div style={s.card}>
          <div style={s.cardLabel}>Entradas</div>
          <div style={{ ...s.cardValue, color: "#10b981" }}>
            {resumo ? fmt(resumo.totalEntradas) : "—"}
          </div>
        </div>

        {/* Despesas variáveis */}
        <div style={s.card}>
          <div style={s.cardLabel}>Despesas do Mês</div>
          <div style={{ ...s.cardValue, color: "#f59e0b" }}>
            {resumo ? fmt(resumo.totalDespesasVariaveis ?? 0) : "—"}
          </div>
        </div>

        {/* Gastos fixos */}
        <div style={{ ...s.card, borderTop: "3px solid #8b5cf6" }}>
          <div style={s.cardLabel}>Gastos Fixos / mês</div>
          <div style={{ ...s.cardValue, color: "#8b5cf6" }}>
            {resumo ? fmt(resumo.totalGastosFixos ?? 0) : "—"}
          </div>
          <div style={s.cardSub}>recorrente todo mês</div>
        </div>

        {/* Resultado */}
        <div style={{ ...s.card, borderTop: `3px solid ${positivo ? "#10b981" : "#ef4444"}` }}>
          <div style={s.cardLabel}>Resultado</div>
          <div style={{ ...s.cardValue, color: positivo ? "#10b981" : "#ef4444" }}>
            {resumo ? fmt(resultado) : "—"}
          </div>
          <div style={s.cardSub}>
            {resumo
              ? `total despesas: ${fmt(resumo.totalDespesas)}`
              : ""}
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div style={s.chartCard}>
        <div style={s.chartHeader}>
          <span style={s.chartTitle}>Despesas por Categoria</span>
          {resumo && (resumo.totalGastosFixos ?? 0) > 0 && (
            <span style={s.badge}>
              inclui {fmt(resumo.totalGastosFixos)} em gastos fixos
            </span>
          )}
        </div>
        {dadosGrafico.length === 0 ? (
          <div style={s.empty}>Nenhuma despesa registrada para {mes}</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={dadosGrafico}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {dadosGrafico.map((_, i) => (
                  <Cell key={i} fill={CORES[i % CORES.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
