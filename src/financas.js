import { loadData, saveData } from "./storage.js";

export const CATEGORIAS_DESPESA = [
  "assinatura",
  "lazer",
  "estacionamento",
  "alimentacao",
  "saude",
  "educacao",
  "moradia",
  "transporte",
  "outros",
];

export const CATEGORIAS_ENTRADA = [
  "salario",
  "mesada",
  "freelance",
  "outros",
];

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function validarValor(valor) {
  const num = parseFloat(valor);
  if (isNaN(num) || num <= 0) {
    throw new Error("Valor inválido. Deve ser um número maior que zero.");
  }
  return num;
}

function validarDescricao(descricao) {
  if (!descricao || descricao.trim().length === 0) {
    throw new Error("Descrição não pode estar vazia.");
  }
  return descricao.trim();
}

function validarCategoriaDespesa(categoria) {
  if (!CATEGORIAS_DESPESA.includes(categoria)) {
    throw new Error(
      `Categoria inválida. Use uma das opções: ${CATEGORIAS_DESPESA.join(", ")}`
    );
  }
  return categoria;
}

function validarCategoriaEntrada(categoria) {
  if (!CATEGORIAS_ENTRADA.includes(categoria)) {
    throw new Error(
      `Categoria inválida. Use uma das opções: ${CATEGORIAS_ENTRADA.join(", ")}`
    );
  }
  return categoria;
}

function mesAtual() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function adicionarEntrada({ descricao, valor, categoria, mes }) {
  const data = loadData();
  const entrada = {
    id: gerarId(),
    descricao: validarDescricao(descricao),
    valor: validarValor(valor),
    categoria: validarCategoriaEntrada(categoria),
    mes: mes || mesAtual(),
    criadoEm: new Date().toISOString(),
  };
  data.entradas.push(entrada);
  saveData(data);
  return entrada;
}

export function adicionarDespesa({ descricao, valor, categoria, mes }) {
  const data = loadData();
  const despesa = {
    id: gerarId(),
    descricao: validarDescricao(descricao),
    valor: validarValor(valor),
    categoria: validarCategoriaDespesa(categoria),
    mes: mes || mesAtual(),
    criadoEm: new Date().toISOString(),
  };
  data.despesas.push(despesa);
  saveData(data);
  return despesa;
}

export function listarEntradas(mes) {
  const data = loadData();
  if (mes) return data.entradas.filter((e) => e.mes === mes);
  return data.entradas;
}

export function listarDespesas(mes) {
  const data = loadData();
  if (mes) return data.despesas.filter((d) => d.mes === mes);
  return data.despesas;
}

export function calcularResumo(mes) {
  const m = mes || mesAtual();
  const entradas = listarEntradas(m);
  const despesas = listarDespesas(m);

  const totalEntradas = entradas.reduce((acc, e) => acc + e.valor, 0);
  const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
  const resultado = totalEntradas - totalDespesas;

  const despesasPorCategoria = {};
  for (const d of despesas) {
    despesasPorCategoria[d.categoria] =
      (despesasPorCategoria[d.categoria] || 0) + d.valor;
  }

  return {
    mes: m,
    totalEntradas,
    totalDespesas,
    resultado,
    despesasPorCategoria,
    entradas,
    despesas,
  };
}

export function removerEntrada(id) {
  const data = loadData();
  const index = data.entradas.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error(`Entrada com ID "${id}" não encontrada.`);
  }
  const [removida] = data.entradas.splice(index, 1);
  saveData(data);
  return removida;
}

export function removerDespesa(id) {
  const data = loadData();
  const index = data.despesas.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error(`Despesa com ID "${id}" não encontrada.`);
  }
  const [removida] = data.despesas.splice(index, 1);
  saveData(data);
  return removida;
}
