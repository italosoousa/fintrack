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

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function validar({ descricao, valor, categoria }) {
  if (!descricao || String(descricao).trim().length === 0) {
    throw new Error("Descrição não pode estar vazia.");
  }
  const num = parseFloat(valor);
  if (isNaN(num) || num <= 0) {
    throw new Error("Valor inválido. Deve ser um número maior que zero.");
  }
  if (!CATEGORIAS_DESPESA.includes(categoria)) {
    throw new Error(
      `Categoria inválida. Use uma das opções: ${CATEGORIAS_DESPESA.join(", ")}`
    );
  }
  return { descricao: String(descricao).trim(), valor: num, categoria };
}

function getLista() {
  const data = loadData();
  return data.gastosFixos ?? [];
}

function salvar(lista) {
  const data = loadData();
  data.gastosFixos = lista;
  saveData(data);
}

export function adicionarGastoFixo(campos) {
  const { descricao, valor, categoria } = validar(campos);
  const lista = getLista();
  const novo = {
    id: gerarId(),
    descricao,
    valor,
    categoria,
    criadoEm: new Date().toISOString(),
  };
  lista.push(novo);
  salvar(lista);
  return novo;
}

export function listarGastosFixos() {
  return getLista();
}

export function atualizarGastoFixo(id, campos) {
  const lista = getLista();
  const idx = lista.findIndex((g) => g.id === id);
  if (idx === -1) {
    throw new Error(`Gasto fixo com ID "${id}" não encontrado.`);
  }
  const atual = lista[idx];
  const validado = validar({
    descricao: campos.descricao ?? atual.descricao,
    valor:     campos.valor     ?? atual.valor,
    categoria: campos.categoria ?? atual.categoria,
  });
  lista[idx] = { ...atual, ...validado, atualizadoEm: new Date().toISOString() };
  salvar(lista);
  return lista[idx];
}

export function removerGastoFixo(id) {
  const lista = getLista();
  const idx = lista.findIndex((g) => g.id === id);
  if (idx === -1) {
    throw new Error(`Gasto fixo com ID "${id}" não encontrado.`);
  }
  const [removido] = lista.splice(idx, 1);
  salvar(lista);
  return removido;
}
