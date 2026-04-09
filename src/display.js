import chalk from "chalk";
import Table from "cli-table3";

export function formatarValor(valor) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

export function exibirResumo(resumo) {
  console.log("\n" + chalk.bold.cyan(`📅 Resumo de ${resumo.mes}`));
  console.log(chalk.gray("─".repeat(40)));

  console.log(
    chalk.green(`  ✅ Total de entradas : ${formatarValor(resumo.totalEntradas)}`)
  );
  console.log(
    chalk.red(`  ❌ Total de despesas : ${formatarValor(resumo.totalDespesas)}`)
  );

  const cor = resumo.resultado >= 0 ? chalk.green : chalk.red;
  const sinal = resumo.resultado >= 0 ? "+" : "";
  console.log(
    cor.bold(`  💰 Resultado         : ${sinal}${formatarValor(resumo.resultado)}`)
  );

  if (Object.keys(resumo.despesasPorCategoria).length > 0) {
    console.log("\n" + chalk.bold("  📊 Despesas por categoria:"));
    for (const [cat, val] of Object.entries(resumo.despesasPorCategoria)) {
      console.log(chalk.yellow(`    • ${cat.padEnd(16)} ${formatarValor(val)}`));
    }
  }

  console.log("");
}

export function exibirTabela(itens, tipo) {
  if (itens.length === 0) {
    console.log(chalk.yellow(`\nNenhum(a) ${tipo} encontrado(a).\n`));
    return;
  }

  const table = new Table({
    head: [
      chalk.bold("ID"),
      chalk.bold("Descrição"),
      chalk.bold("Categoria"),
      chalk.bold("Valor"),
      chalk.bold("Mês"),
    ],
    colWidths: [12, 28, 16, 14, 10],
  });

  for (const item of itens) {
    const cor = tipo === "entrada" ? chalk.green : chalk.red;
    table.push([
      item.id,
      item.descricao,
      item.categoria,
      cor(formatarValor(item.valor)),
      item.mes,
    ]);
  }

  console.log("\n" + table.toString() + "\n");
}
