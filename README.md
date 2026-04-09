# 💸 FinTrack — Controle Financeiro Pessoal

![CI](https://github.com/italosoousa/fintrack/actions/workflows/ci.yml/badge.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📌 Problema Real

Muitas pessoas têm dificuldade em acompanhar suas finanças pessoais de forma organizada. Sem visibilidade clara sobre entradas e despesas mensais, é comum gastar mais do que se ganha sem perceber — o que leva a dívidas, estresse financeiro e falta de planejamento.

## 💡 Proposta da Solução

O **FinTrack** é um sistema de controle financeiro pessoal com interface **CLI** (linha de comando) e **GUI** (interface gráfica web), que permite registrar entradas, despesas variáveis e gastos fixos recorrentes, visualizar o resumo financeiro mensal com gráficos e acompanhar para onde o dinheiro está indo — de forma simples, rápida e sem depender de apps externos ou internet.

## 👥 Público-alvo

Qualquer pessoa que queira ter controle sobre suas finanças pessoais de forma prática, especialmente estudantes, freelancers e jovens profissionais.

## ✅ Funcionalidades

- Registrar **entradas** (salário, mesada, freelance, outros)
- Registrar **despesas variáveis** por categoria (assinatura, lazer, moradia, saúde...)
- Gerenciar **gastos fixos** recorrentes — cadastre uma vez, vale todo mês
- **Listar** lançamentos filtrando por mês e tipo
- Visualizar **resumo mensal** com total de entradas, despesas e resultado
- **Remover** lançamentos pelo ID
- **Gráfico de pizza** com despesas por categoria (GUI)
- **Dashboard** com seletor de mês (GUI)
- Persistência local em arquivo JSON (sem banco de dados externo)

## 🛠️ Tecnologias

**Backend / CLI**
- [Node.js](https://nodejs.org/) v20+
- [Express](https://expressjs.com/) — servidor REST API
- [Commander.js](https://github.com/tj/commander.js) — interface CLI
- [Chalk](https://github.com/chalk/chalk) — cores no terminal
- [cli-table3](https://github.com/cli-table/cli-table3) — tabelas formatadas

**Frontend (GUI)**
- [React](https://react.dev/) — interface gráfica
- [Vite](https://vitejs.dev/) — build e dev server
- [Recharts](https://recharts.org/) — gráficos

**Qualidade e CI**
- [Jest](https://jestjs.io/) — testes automatizados
- [ESLint](https://eslint.org/) — análise estática de código
- [GitHub Actions](https://github.com/features/actions) — integração contínua

## 📁 Estrutura do Projeto

```
fintrack/
├── src/
│   ├── index.js          # Ponto de entrada CLI
│   ├── financas.js       # Lógica de negócio (entradas e despesas)
│   ├── gastosFixos.js    # Lógica de negócio (gastos fixos)
│   ├── storage.js        # Persistência em JSON
│   ├── display.js        # Formatação de saída CLI
│   └── server.js         # Servidor Express com API REST
├── client/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── Dashboard.jsx     # Resumo + gráfico
│   │       ├── Lancamentos.jsx   # Formulários e tabela
│   │       └── GastosFixos.jsx   # CRUD de gastos fixos
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── tests/
│   └── financas.test.js
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── REQUISITOS.md
└── package.json
```

## 🚀 Instalação

**Pré-requisitos:** Node.js v20 ou superior.

```bash
# Clone o repositório
git clone https://github.com/italosoousa/fintrack.git
cd fintrack

# Instale as dependências do backend
npm install

# Instale as dependências do frontend
cd client && npm install && cd ..
```

## ▶️ Execução

### Interface Gráfica (GUI) — recomendado

```bash
# Terminal 1 — inicia o servidor backend (porta 3001)
npm run server

# Terminal 2 — inicia o frontend (porta 5173)
npm run client
```

Acesse **http://localhost:5173** no navegador.

### Interface CLI

```bash
# Ver todos os comandos disponíveis
node src/index.js --help

# Registrar uma entrada
node src/index.js entrada -d "Salário" -v 5000 -c salario

# Registrar uma despesa
node src/index.js despesa -d "Spotify" -v 12.90 -c assinatura

# Listar lançamentos do mês
node src/index.js listar -m 2026-04

# Ver resumo do mês atual
node src/index.js resumo

# Remover um lançamento
node src/index.js remover -i <ID> -t despesa
```

### Categorias disponíveis

**Entradas:** `salario`, `mesada`, `freelance`, `outros`

**Despesas / Gastos Fixos:** `assinatura`, `lazer`, `estacionamento`, `alimentacao`, `saude`, `educacao`, `moradia`, `transporte`, `outros`

### Endpoints da API REST

| Método   | Endpoint                | Descrição              |
|----------|-------------------------|------------------------|
| POST     | `/api/entradas`         | Adicionar entrada      |
| POST     | `/api/despesas`         | Adicionar despesa      |
| GET      | `/api/entradas?mes=`    | Listar entradas        |
| GET      | `/api/despesas?mes=`    | Listar despesas        |
| GET      | `/api/resumo?mes=`      | Resumo mensal          |
| DELETE   | `/api/entradas/:id`     | Remover entrada        |
| DELETE   | `/api/despesas/:id`     | Remover despesa        |
| GET      | `/api/gastos-fixos`     | Listar gastos fixos    |
| POST     | `/api/gastos-fixos`     | Adicionar gasto fixo   |
| PUT      | `/api/gastos-fixos/:id` | Atualizar gasto fixo   |
| DELETE   | `/api/gastos-fixos/:id` | Remover gasto fixo     |

## 🧪 Testes

```bash
npm test
```

Os testes cobrem:
- ✅ Caminho feliz (registrar, listar, calcular resumo, remover)
- ❌ Entradas inválidas (valor negativo, zero, texto, descrição vazia, categoria inválida)
- 🔲 Casos limite (mês sem dados, resultado negativo, ID inexistente, valor decimal)

**18 testes** — todos passando.

## 🔍 Lint

```bash
npm run lint
```

Utiliza **ESLint** com regras de aspas duplas, ponto-e-vírgula obrigatório e indentação de 2 espaços.

## ⚙️ CI — GitHub Actions

O pipeline executa automaticamente a cada `push` e `pull_request` nas branches `main` e `develop`:

1. Checkout do repositório
2. Setup do Node.js (versões 20 e 22 em paralelo)
3. Instalação de dependências (`npm ci`)
4. Lint (`npm run lint`)
5. Testes (`npm test`)

Acompanhe em: [github.com/italosoousa/fintrack/actions](https://github.com/italosoousa/fintrack/actions)

## 📌 Versão

**1.0.0** — Veja o [CHANGELOG](./CHANGELOG.md) para o histórico de mudanças.

## 👤 Autor

**Italo Sousa**
Repositório: [https://github.com/italosoousa/fintrack](https://github.com/italosoousa/fintrack)
