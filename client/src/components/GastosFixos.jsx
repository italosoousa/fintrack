import { useEffect, useState, useCallback } from "react";

const CATEGORIAS = [
  "assinatura", "lazer", "estacionamento", "alimentacao",
  "saude", "educacao", "moradia", "transporte", "outros",
];

const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const FORM_VAZIO = { descricao: "", valor: "", categoria: "" };

const s = {
  layout: { display: "grid", gridTemplateColumns: "340px 1fr", gap: "1.5rem", alignItems: "start" },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  titulo: { fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" },
  campo: { display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.75rem" },
  label: { fontSize: "0.8rem", fontWeight: "600", color: "#6b7280" },
  input: {
    padding: "0.5rem 0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
  },
  inputSm: {
    padding: "0.3rem 0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "0.85rem",
    outline: "none",
    width: "100%",
  },
  btnAdd: {
    width: "100%",
    padding: "0.6rem",
    background: "#8b5cf6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.9rem",
    marginTop: "0.25rem",
    cursor: "pointer",
  },
  tabela: { width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" },
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
  td: { padding: "0.65rem 0.75rem", borderBottom: "1px solid #f3f4f6", verticalAlign: "middle" },
  tdAcoes: { padding: "0.5rem 0.75rem", borderBottom: "1px solid #f3f4f6", verticalAlign: "middle", whiteSpace: "nowrap" },
  btnEditar: {
    padding: "0.25rem 0.7rem",
    background: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    color: "#374151",
    fontSize: "0.8rem",
    cursor: "pointer",
    marginRight: "0.4rem",
  },
  btnSalvar: {
    padding: "0.25rem 0.7rem",
    background: "#8b5cf6",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "0.8rem",
    cursor: "pointer",
    marginRight: "0.4rem",
  },
  btnCancelar: {
    padding: "0.25rem 0.7rem",
    background: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    color: "#6b7280",
    fontSize: "0.8rem",
    cursor: "pointer",
    marginRight: "0.4rem",
  },
  btnRemover: {
    padding: "0.25rem 0.7rem",
    background: "transparent",
    border: "1px solid #fca5a5",
    borderRadius: "4px",
    color: "#ef4444",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  totalBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.85rem 0.75rem",
    borderTop: "2px solid #e5e7eb",
    fontWeight: "700",
    fontSize: "0.95rem",
  },
  msg: (ok) => ({
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    marginBottom: "0.75rem",
    fontSize: "0.85rem",
    background: ok ? "#ede9fe" : "#fee2e2",
    color: ok ? "#5b21b6" : "#991b1b",
  }),
  empty: { textAlign: "center", color: "#9ca3af", padding: "2.5rem", fontSize: "0.95rem" },
  badgeCateg: {
    display: "inline-block",
    padding: "0.15rem 0.55rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    background: "#ede9fe",
    color: "#5b21b6",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  count: {
    fontSize: "0.82rem",
    background: "#f3f4f6",
    color: "#6b7280",
    padding: "0.2rem 0.65rem",
    borderRadius: "999px",
    fontWeight: "500",
  },
};

export default function GastosFixos() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [msg, setMsg] = useState(null);

  // edição inline
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const carregar = useCallback(async () => {
    try {
      const res = await fetch("/api/gastos-fixos");
      if (!res.ok) throw new Error();
      setLista(await res.json());
    } catch {
      setMsg({ ok: false, texto: "Erro ao carregar gastos fixos." });
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  // ── Adicionar ────────────────────────────────────────────────────────────────

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const adicionar = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch("/api/gastos-fixos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, valor: parseFloat(form.valor) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm(FORM_VAZIO);
      setMsg({ ok: true, texto: "Gasto fixo adicionado!" });
      carregar();
    } catch (err) {
      setMsg({ ok: false, texto: err.message });
    }
  };

  // ── Editar ───────────────────────────────────────────────────────────────────

  const iniciarEdicao = (item) => {
    setEditandoId(item.id);
    setEditForm({ descricao: item.descricao, valor: item.valor, categoria: item.categoria });
  };

  const cancelarEdicao = () => { setEditandoId(null); setEditForm({}); };

  const setE = (k) => (e) => setEditForm((f) => ({ ...f, [k]: e.target.value }));

  const salvar = async (id) => {
    setMsg(null);
    try {
      const res = await fetch(`/api/gastos-fixos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, valor: parseFloat(editForm.valor) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditandoId(null);
      setMsg({ ok: true, texto: "Gasto fixo atualizado!" });
      carregar();
    } catch (err) {
      setMsg({ ok: false, texto: err.message });
    }
  };

  // ── Remover ──────────────────────────────────────────────────────────────────

  const remover = async (id) => {
    if (!confirm("Remover este gasto fixo?")) return;
    try {
      const res = await fetch(`/api/gastos-fixos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setMsg({ ok: true, texto: "Gasto fixo removido." });
      carregar();
    } catch (err) {
      setMsg({ ok: false, texto: err.message });
    }
  };

  const total = lista.reduce((acc, g) => acc + g.valor, 0);

  return (
    <div>
      {msg && <div style={s.msg(msg.ok)}>{msg.texto}</div>}

      <div style={s.layout}>
        {/* ── Formulário de adição ── */}
        <div style={s.card}>
          <div style={s.titulo}>📌 Novo Gasto Fixo</div>
          <form onSubmit={adicionar}>
            <div style={s.campo}>
              <label style={s.label}>Descrição</label>
              <input
                style={s.input}
                value={form.descricao}
                onChange={setF("descricao")}
                placeholder="Ex: Netflix, Aluguel..."
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
                onChange={setF("valor")}
                placeholder="0,00"
                required
              />
            </div>
            <div style={s.campo}>
              <label style={s.label}>Categoria</label>
              <select
                style={s.input}
                value={form.categoria}
                onChange={setF("categoria")}
                required
              >
                <option value="">Selecione...</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button style={s.btnAdd} type="submit">Adicionar Gasto Fixo</button>
          </form>
        </div>

        {/* ── Tabela ── */}
        <div style={s.card}>
          <div style={s.headerRow}>
            <span style={s.titulo}>Gastos Fixos Cadastrados</span>
            <span style={s.count}>{lista.length} item{lista.length !== 1 ? "s" : ""}</span>
          </div>

          {lista.length === 0 ? (
            <div style={s.empty}>
              Nenhum gasto fixo cadastrado ainda.<br />
              <span style={{ fontSize: "0.85rem" }}>
                Adicione assinaturas, aluguel, mensalidades e outros gastos recorrentes.
              </span>
            </div>
          ) : (
            <table style={s.tabela}>
              <thead>
                <tr>
                  <th style={s.th}>Descrição</th>
                  <th style={s.th}>Categoria</th>
                  <th style={s.th}>Valor / mês</th>
                  <th style={s.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((item) =>
                  editandoId === item.id ? (
                    // ── Linha em edição ──
                    <tr key={item.id} style={{ background: "#faf5ff" }}>
                      <td style={s.td}>
                        <input
                          style={s.inputSm}
                          value={editForm.descricao}
                          onChange={setE("descricao")}
                        />
                      </td>
                      <td style={s.td}>
                        <select style={s.inputSm} value={editForm.categoria} onChange={setE("categoria")}>
                          {CATEGORIAS.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </td>
                      <td style={s.td}>
                        <input
                          style={s.inputSm}
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={editForm.valor}
                          onChange={setE("valor")}
                        />
                      </td>
                      <td style={s.tdAcoes}>
                        <button style={s.btnSalvar} onClick={() => salvar(item.id)}>Salvar</button>
                        <button style={s.btnCancelar} onClick={cancelarEdicao}>Cancelar</button>
                      </td>
                    </tr>
                  ) : (
                    // ── Linha normal ──
                    <tr key={item.id}>
                      <td style={s.td}>{item.descricao}</td>
                      <td style={s.td}>
                        <span style={s.badgeCateg}>{item.categoria}</span>
                      </td>
                      <td style={{ ...s.td, fontWeight: "600", color: "#8b5cf6" }}>
                        {fmt(item.valor)}
                      </td>
                      <td style={s.tdAcoes}>
                        <button style={s.btnEditar} onClick={() => iniciarEdicao(item)}>
                          Editar
                        </button>
                        <button style={s.btnRemover} onClick={() => remover(item.id)}>
                          Remover
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}

          {lista.length > 0 && (
            <div style={s.totalBar}>
              <span>Total mensal</span>
              <span style={{ color: "#8b5cf6" }}>{fmt(total)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
