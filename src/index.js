#!/usr/bin/env node
import { program } from "commander";
import chalk from "chalk";
import {
  adicionarEntrada,
  adicionarDespesa,
  listarEntradas,
  listarDespesas,
  calcularResumo,
  removerEntrada,
  removerDespesa,
  CATEGORIAS_DESPESA,
  CATEGORIAS_ENTRADA,
} from "./financas.js";
import { exibirResumo, exibirTabela } from "./display.js";

program
  .name("fintrack")
  .description("💸 FinTrack — Controle financeiro pessoal via CLI")
  .version("1.0.0");

// ── ENTRADAS ──────────────────────────────────────────────
program
  .command("entrada")
  .description("Registrar uma nova entrada (receita)")
  .requiredOption("-d, --descricao <texto>", "Descrição da entrada")
  .requiredOption("-v, --valor <numero>", "Valor da entrada")
  .requiredOption(
    "-c, --categoria <tipo>",
    `Categoria: ${CATEGORIAS_ENTRADA.join(", ")}`
  )
  .option("-m, --mes <YYYY-MM>", "Mês de referência (padrão: mês atual)")
  .action((opts) => {
    try {
      const entrada = adicionarEntrada(opts);
      console.log(chalk.green("\n✅ Entrada registrada com sucesso!"));
      console.log(chalk.gray(`   ID: ${entrada.id}`));
      console.log(chalk.gray(`   ${entrada.descricao} — R$ ${entrada.valor.toFixed(2)}\n`));
    } catch (err) {
      console.error(chalk.red(`\n❌ Erro: ${err.message}\n`));
      process.exit(1);
    }
  });

// ── DESPESAS ──────────────────────────────────────────────
program
  .command("despesa")
  .description("Registrar uma nova despesa")
  .requiredOption("-d, --descricao <texto>", "Descrição da despesa")
  .requiredOption("-v, --valor <numero>", "Valor da despesa")
  .requiredOption(
    "-c, --categoria <tipo>",
    `Categoria: ${CATEGORIAS_DESPESA.join(", ")}`
  )
  .option("-m, --mes <YYYY-MM>", "Mês de referência (padrão: mês atual)")
  .action((opts) => {
    try {
      const despesa = adicionarDespesa(opts);
      console.log(chalk.green("\n✅ Despesa registrada com sucesso!"));
      console.log(chalk.gray(`   ID: ${despesa.id}`));
      console.log(chalk.gray(`   ${despesa.descricao} — R$ ${despesa.valor.toFixed(2)}\n`));
    } catch (err) {
      console.error(chalk.red(`\n❌ Erro: ${err.message}\n`));
      process.exit(1);
    }
  });

// ── LISTAR ────────────────────────────────────────────────
program
  .command("listar")
  .description("Listar entradas e despesas")
  .option("-m, --mes <YYYY-MM>", "Filtrar por mês")
  .option("-t, --tipo <entrada|despesa>", "Filtrar por tipo")
  .action((opts) => {
    const { mes, tipo } = opts;
    if (!tipo || tipo === "entrada") {
      const entradas = listarEntradas(mes);
      console.log(chalk.bold.cyan("\n📥 Entradas:"));
      exibirTabela(entradas, "entrada");
    }
    if (!tipo || tipo === "despesa") {
      const despesas = listarDespesas(mes);
      console.log(chalk.bold.cyan("📤 Despesas:"));
      exibirTabela(despesas, "despesa");
    }
  });

// ── RESUMO ────────────────────────────────────────────────
program
  .command("resumo")
  .description("Exibir resumo financeiro do mês")
  .option("-m, --mes <YYYY-MM>", "Mês de referência (padrão: mês atual)")
  .action((opts) => {
    const resumo = calcularResumo(opts.mes);
    exibirResumo(resumo);
  });

// ── REMOVER ───────────────────────────────────────────────
program
  .command("remover")
  .description("Remover um lançamento pelo ID")
  .requiredOption("-i, --id <id>", "ID do lançamento")
  .requiredOption("-t, --tipo <entrada|despesa>", "Tipo do lançamento")
  .action((opts) => {
    try {
      let removido;
      if (opts.tipo === "entrada") {
        removido = removerEntrada(opts.id);
      } else if (opts.tipo === "despesa") {
        removido = removerDespesa(opts.id);
      } else {
        throw new Error("Tipo inválido. Use 'entrada' ou 'despesa'.");
      }
      console.log(chalk.green(`\n🗑️  Removido: ${removido.descricao}\n`));
    } catch (err) {
      console.error(chalk.red(`\n❌ Erro: ${err.message}\n`));
      process.exit(1);
    }
  });

program.parse();
