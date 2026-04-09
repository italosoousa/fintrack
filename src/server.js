import express from "express";
import cors from "cors";
import {
  adicionarEntrada,
  adicionarDespesa,
  listarEntradas,
  listarDespesas,
  calcularResumo,
  removerEntrada,
  removerDespesa,
} from "./financas.js";
import {
  adicionarGastoFixo,
  listarGastosFixos,
  atualizarGastoFixo,
  removerGastoFixo,
} from "./gastosFixos.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ── Entradas ─────────────────────────────────────────────────────────────────

app.post("/api/entradas", (req, res) => {
  try {
    res.status(201).json(adicionarEntrada(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/entradas", (req, res) => {
  try {
    res.json(listarEntradas(req.query.mes));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/entradas/:id", (req, res) => {
  try {
    res.json(removerEntrada(req.params.id));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ── Despesas variáveis ────────────────────────────────────────────────────────

app.post("/api/despesas", (req, res) => {
  try {
    res.status(201).json(adicionarDespesa(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/despesas", (req, res) => {
  try {
    res.json(listarDespesas(req.query.mes));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/despesas/:id", (req, res) => {
  try {
    res.json(removerDespesa(req.params.id));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ── Gastos fixos ──────────────────────────────────────────────────────────────

app.get("/api/gastos-fixos", (req, res) => {
  try {
    res.json(listarGastosFixos());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/gastos-fixos", (req, res) => {
  try {
    res.status(201).json(adicionarGastoFixo(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/gastos-fixos/:id", (req, res) => {
  try {
    res.json(atualizarGastoFixo(req.params.id, req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/gastos-fixos/:id", (req, res) => {
  try {
    res.json(removerGastoFixo(req.params.id));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ── Resumo (inclui gastos fixos) ──────────────────────────────────────────────

app.get("/api/resumo", (req, res) => {
  try {
    const resumo = calcularResumo(req.query.mes);
    const gastosFixos = listarGastosFixos();
    const totalGastosFixos = gastosFixos.reduce((acc, g) => acc + g.valor, 0);

    // Incorpora gastos fixos no totais e no breakdown por categoria
    const despesasPorCategoria = { ...resumo.despesasPorCategoria };
    for (const g of gastosFixos) {
      despesasPorCategoria[g.categoria] =
        (despesasPorCategoria[g.categoria] || 0) + g.valor;
    }

    const totalDespesas = resumo.totalDespesas + totalGastosFixos;
    const resultado     = resumo.totalEntradas - totalDespesas;

    res.json({
      ...resumo,
      totalDespesas,
      resultado,
      despesasPorCategoria,
      totalGastosFixos,
      totalDespesasVariaveis: resumo.totalDespesas,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Servidor FinTrack rodando em http://localhost:${PORT}`);
});
