import { jest } from "@jest/globals";

// Mock storage to avoid touching real data.json during tests
jest.unstable_mockModule("../src/storage.js", () => {
  let store = { entradas: [], despesas: [] };
  return {
    loadData: jest.fn(() => JSON.parse(JSON.stringify(store))),
    saveData: jest.fn((data) => {
      store = JSON.parse(JSON.stringify(data));
    }),
    resetData: jest.fn(() => {
      store = { entradas: [], despesas: [] };
    }),
    __setStore: (data) => { store = JSON.parse(JSON.stringify(data)); },
    __getStore: () => JSON.parse(JSON.stringify(store)),
  };
});

const {
  adicionarEntrada,
  adicionarDespesa,
  listarEntradas,
  listarDespesas,
  calcularResumo,
  removerEntrada,
  removerDespesa,
} = await import("../src/financas.js");

const storage = await import("../src/storage.js");

beforeEach(() => {
  storage.__setStore({ entradas: [], despesas: [] });
});

// ─────────────────────────────────────────────
// CAMINHO FELIZ — fluxo correto
// ─────────────────────────────────────────────

describe("Caminho feliz", () => {
  test("deve registrar uma entrada válida corretamente", () => {
    const entrada = adicionarEntrada({
      descricao: "Salário",
      valor: "5000",
      categoria: "salario",
      mes: "2026-04",
    });

    expect(entrada.descricao).toBe("Salário");
    expect(entrada.valor).toBe(5000);
    expect(entrada.categoria).toBe("salario");
    expect(entrada.mes).toBe("2026-04");
    expect(entrada.id).toBeDefined();
  });

  test("deve registrar uma despesa válida corretamente", () => {
    const despesa = adicionarDespesa({
      descricao: "Spotify",
      valor: "12.90",
      categoria: "assinatura",
      mes: "2026-04",
    });

    expect(despesa.descricao).toBe("Spotify");
    expect(despesa.valor).toBe(12.9);
    expect(despesa.categoria).toBe("assinatura");
  });

  test("deve listar apenas entradas do mês filtrado", () => {
    adicionarEntrada({ descricao: "Mesada", valor: "3500", categoria: "mesada", mes: "2026-04" });
    adicionarEntrada({ descricao: "Freelance", valor: "800", categoria: "freelance", mes: "2026-03" });

    const resultado = listarEntradas("2026-04");
    expect(resultado).toHaveLength(1);
    expect(resultado[0].descricao).toBe("Mesada");
  });

  test("deve calcular resumo corretamente", () => {
    adicionarEntrada({ descricao: "Salário", valor: "5000", categoria: "salario", mes: "2026-04" });
    adicionarDespesa({ descricao: "Academia", valor: "300", categoria: "saude", mes: "2026-04" });
    adicionarDespesa({ descricao: "Spotify", valor: "12.90", categoria: "assinatura", mes: "2026-04" });

    const resumo = calcularResumo("2026-04");
    expect(resumo.totalEntradas).toBe(5000);
    expect(resumo.totalDespesas).toBeCloseTo(312.9);
    expect(resumo.resultado).toBeCloseTo(4687.1);
  });

  test("deve remover uma entrada existente pelo ID", () => {
    const entrada = adicionarEntrada({ descricao: "Mesada", valor: "3500", categoria: "mesada", mes: "2026-04" });
    const removida = removerEntrada(entrada.id);

    expect(removida.id).toBe(entrada.id);
    expect(listarEntradas("2026-04")).toHaveLength(0);
  });

  test("deve remover uma despesa existente pelo ID", () => {
    const despesa = adicionarDespesa({ descricao: "Netflix", valor: "45", categoria: "assinatura", mes: "2026-04" });
    removerDespesa(despesa.id);

    expect(listarDespesas("2026-04")).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────
// ENTRADAS INVÁLIDAS
// ─────────────────────────────────────────────

describe("Entradas inválidas", () => {
  test("deve lançar erro ao registrar entrada com valor negativo", () => {
    expect(() =>
      adicionarEntrada({ descricao: "Teste", valor: "-100", categoria: "salario" })
    ).toThrow("Valor inválido");
  });

  test("deve lançar erro ao registrar entrada com valor zero", () => {
    expect(() =>
      adicionarEntrada({ descricao: "Teste", valor: "0", categoria: "salario" })
    ).toThrow("Valor inválido");
  });

  test("deve lançar erro ao registrar entrada com valor texto", () => {
    expect(() =>
      adicionarEntrada({ descricao: "Teste", valor: "abc", categoria: "salario" })
    ).toThrow("Valor inválido");
  });

  test("deve lançar erro ao registrar entrada com descrição vazia", () => {
    expect(() =>
      adicionarEntrada({ descricao: "", valor: "100", categoria: "salario" })
    ).toThrow("Descrição não pode estar vazia");
  });

  test("deve lançar erro ao registrar despesa com categoria inválida", () => {
    expect(() =>
      adicionarDespesa({ descricao: "Teste", valor: "50", categoria: "viagem" })
    ).toThrow("Categoria inválida");
  });

  test("deve lançar erro ao registrar entrada com categoria inválida", () => {
    expect(() =>
      adicionarEntrada({ descricao: "Teste", valor: "50", categoria: "loteria" })
    ).toThrow("Categoria inválida");
  });
});

// ─────────────────────────────────────────────
// CASOS LIMITE (EDGE CASES)
// ─────────────────────────────────────────────

describe("Casos limite", () => {
  test("resumo deve retornar zeros quando não há lançamentos no mês", () => {
    const resumo = calcularResumo("2026-01");
    expect(resumo.totalEntradas).toBe(0);
    expect(resumo.totalDespesas).toBe(0);
    expect(resumo.resultado).toBe(0);
  });

  test("resultado deve ser negativo quando despesas superam entradas", () => {
    adicionarEntrada({ descricao: "Salário", valor: "1000", categoria: "salario", mes: "2026-04" });
    adicionarDespesa({ descricao: "Aluguel", valor: "1500", categoria: "moradia", mes: "2026-04" });

    const resumo = calcularResumo("2026-04");
    expect(resumo.resultado).toBeLessThan(0);
    expect(resumo.resultado).toBeCloseTo(-500);
  });

  test("deve lançar erro ao tentar remover entrada com ID inexistente", () => {
    expect(() => removerEntrada("id-inexistente")).toThrow("não encontrada");
  });

  test("deve lançar erro ao tentar remover despesa com ID inexistente", () => {
    expect(() => removerDespesa("id-inexistente")).toThrow("não encontrada");
  });

  test("deve aceitar valor decimal com ponto", () => {
    const despesa = adicionarDespesa({
      descricao: "Streaming",
      valor: "12.90",
      categoria: "assinatura",
    });
    expect(despesa.valor).toBeCloseTo(12.9);
  });

  test("listar sem filtro de mês deve retornar todos os registros", () => {
    adicionarDespesa({ descricao: "A", valor: "10", categoria: "outros", mes: "2026-01" });
    adicionarDespesa({ descricao: "B", valor: "20", categoria: "outros", mes: "2026-02" });
    adicionarDespesa({ descricao: "C", valor: "30", categoria: "outros", mes: "2026-03" });

    expect(listarDespesas()).toHaveLength(3);
  });
});
