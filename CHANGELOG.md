# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-04-08

### Adicionado
- Comando `entrada` para registrar receitas com descrição, valor e categoria
- Comando `despesa` para registrar gastos com descrição, valor e categoria
- Comando `listar` para visualizar lançamentos com filtro por mês e tipo
- Comando `resumo` com total de entradas, despesas, resultado e breakdown por categoria
- Comando `remover` para excluir lançamentos pelo ID
- Persistência local em arquivo `data.json`
- Testes automatizados com Jest (caminho feliz, entradas inválidas, casos limite)
- Linting com ESLint
- Pipeline de CI com GitHub Actions (Node.js 20 e 22)
