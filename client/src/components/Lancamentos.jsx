import { useEffect, useState, useCallback } from "react";

const CATEGORIAS_ENTRADA = ["salario", "mesada", "freelance", "outros"];
const CATEGORIAS_DESPESA = [
  "assinatura", "lazer", "estacionamento", "alimentacao",
  "saude", "educacao", "moradia", "transporte", "outros",
];

const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formVazio = (mes) => ({ descricao: "", valor: "", categoria: "", mes });

const s = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
    marginBottom: "1.5rem",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  titulo: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#374151",
  },
  campo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
    marginBottom: "0.75rem",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#6b7280",
  },
  input: {
    padding: "0.5rem 0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.9rem",
    outline: "none",
  },
  btnEntrada: {
    width: "100%",
    padding: "0.6rem",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.9rem",
    marginTop: "0.25rem",
  },
  btnDespesa: {
    width: "100%",
    padding: "0.6rem",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.9rem",
    marginTop: "0.25rem",
  },
  tabelaCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
  },
  th: {
    textAlign: "left",
    padding: "0.6rem 0.75rem",
    borderBottom: "2px solid #e5e7eb",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#6b7280",
    letterSpacing: "0.05em",
  },
  td: {
    padding: "0.65rem 0.75rem",
    borderBottom: "1px solid #f3f4f6",
    verticalAlign: "middle",
  },
  badge: (tipo) => ({
    display: "inline-block",
    padding: "0.15rem 0.55rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    background: tipo === "entrada" ? "#d1fae5" : "#fee2e2",
    color: tipo === "entrada" ? "#065f46" : "#991b1b",
  }),
  btnRemover: {
    padding: "0.25rem 0.65rem",
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    color: "#6b7280",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  msg: (ok) => ({
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    marginBottom: "0.75rem",
    fontSize: "0.85rem",
    background: ok ? "#d1fae5" : "#fee2e2",
    color: ok ? "#065f46" : "#991b1b",
  }),
  empty: {
    textAlign: "center",
    color: "#9ca3af",
    padding: "2rem",
    fontSize: "0.95rem",
  },
};

function Formulario({ tipo, mes, onSucesso }) {
  const [form, setForm] = useState(formVazio(mes));
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setForm((f) => ({ ...f, mes }));
  }, [mes]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch(`/api/${tipo === "entrada" ? "entradas" : "despesas"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, valor: parseFloat(form.valor) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ ok: true, texto: `${tipo === "entrada" ? "Entrada" : "Despesa"} adicionada!` });
      setForm(formVazio(mes));
      onSucesso();
    } catch (err) {
      setMsg({ ok: false, texto: err.message });
    }
  };

  const categorias = tipo === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_DESPESA;
  const btnStyle = tipo === "entrada" ? s.btnEntrada : s.btnDespesa;

  return (
    <div style={s.card}>
      <div style={s.titulo}>
        {tipo === "entrada" ? "➕ Nova Entrada" : "➖ Nova Despesa"}
      </div>
      {msg && <div style={s.msg(msg.ok)}>{msg.texto}</div>}
      <form onSubmit={enviar}>
        <div style={s.campo}>
          <label style={s.label}>Descrição</label>
          <input
            style={s.input}
            value={form.descricao}
            onChange={set("descricao")}
            placeholder="Ex: Salário mensal"
            required
          />
        </div>
        <div style={s.campo}>
          <label style={s.label}>Valor (R$)</label>
          <input
            style={s.input}
            type="number"
            min="0.01"
            step="0.01"
            value={form.valor}
            onChange={set("valor")}
            placeholder="0,00"
            required
          />
        </div>
        <div style={s.campo}>
          <label style={s.label}>Categoria</label>
          <select style={s.input} value={form.categoria} onChange={set("categoria")} required>
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div style={s.campo}>
          <label style={s.label}>Mês</label>
          <input
            style={s.input}
            type="month"
            value={form.mes}
            onChange={set("mes")}
            required
          />
        </div>
        <button style={btnStyle} type="submit">Adicionar</button>
      </form>
    </div>
  );
}

export default function Lancamentos({ mes }) {
  const [entradas, setEntradas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setErro("");
    try {
      const [resE, resD] = await Promise.all([
        fetch(`/api/entradas?mes=${mes}`),
        fetch(`/api/despesas?mes=${mes}`),
      ]);
      if (!resE.ok || !resD.ok) throw new Error();
      const [e, d] = await Promise.all([resE.json(), resD.json()]);
      setEntradas(e);
      setDespesas(d);
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    }
  }, [mes]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const remover = async (tipo, id) => {
    try {
      await fetch(`/api/${tipo}/${id}`, { method: "DELETE" });
      carregar();
    } catch {
      setErro("Erro ao remover lançamento.");
    }
  };

  const itens = [
    ...entradas.map((e) => ({ ...e, tipo: "entrada" })),
    ...despesas.map((d) => ({ ...d, tipo: "despesa" })),
  ].sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

  return (
    <div>
      {erro && <div style={s.msg(false)}>{erro}</div>}
      <div style={s.grid}>
        <Formulario tipo="entrada" mes={mes} onSucesso={carregar} />
        <Formulario tipo="despesa" mes={mes} onSucesso={carregar} />
      </div>

      <div style={s.tabelaCard}>
        <div style={s.titulo}>Lançamentos de {mes}</div>
        {itens.length === 0 ? (
          <div style={s.empty}>Nenhum lançamento para este mês</div>
        ) : (
          <table style={s.tabela}>
            <thead>
              <tr>
                <th style={s.th}>Tipo</th>
                <th style={s.th}>Descrição</th>
                <th style={s.th}>Categoria</th>
                <th style={s.th}>Valor</th>
                <th style={s.th}></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id}>
                  <td style={s.td}>
                    <span style={s.badge(item.tipo)}>
                      {item.tipo === "entrada" ? "entrada" : "despesa"}
                    </span>
                  </td>
                  <td style={s.td}>{item.descricao}</td>
                  <td style={s.td}>{item.categoria}</td>
                  <td style={s.td}>
                    <span style={{ color: item.tipo === "entrada" ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                      {fmt(item.valor)}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button
                      style={s.btnRemover}
                      onClick={() => remover(item.tipo === "entrada" ? "entradas" : "despesas", item.id)}
                    >
                      remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
