# 💸 FinTrack — Controle Financeiro Pessoal via CLI

![CI](https://github.com/SEU_USUARIO/fintrack/actions/workflows/ci.yml/badge.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📌 Problema Real

Muitas pessoas têm dificuldade em acompanhar suas finanças pessoais de forma organizada. Sem visibilidade clara sobre entradas e despesas mensais, é comum gastar mais do que se ganha sem perceber — o que leva a dívidas, estresse financeiro e falta de planejamento.

## 💡 Proposta da Solução

O **FinTrack** é uma ferramenta de linha de comando (CLI) que permite registrar entradas e despesas, visualizar o resumo financeiro do mês e acompanhar para onde o dinheiro está indo — de forma simples, rápida e sem depender de apps externos ou internet.

## 👥 Público-alvo

Qualquer pessoa que queira ter controle sobre suas finanças pessoais de forma prática, especialmente estudantes, freelancers e jovens profissionais.

## ✅ Funcionalidades

- Registrar **entradas** (salário, mesada, freelance...)
- Registrar **despesas** por categoria (assinatura, lazer, moradia, saúde...)
- **Listar** lançamentos filtrando por mês e tipo
- Visualizar **resumo mensal** com total de entradas, despesas e resultado
- **Remover** lançamentos pelo ID
- Persistência local em arquivo JSON (sem banco de dados externo)

## 🛠️ Tecnologias

- [Node.js](https://nodejs.org/) v20+
- [Commander.js](https://github.com/tj/commander.js) — interface CLI
- [Chalk](https://github.com/chalk/chalk) — cores no terminal
- [cli-table3](https://github.com/cli-table/cli-table3) — tabelas formatadas
- [Jest](https://jestjs.io/) — testes automatizados
- [ESLint](https://eslint.org/) — análise estática de código
- [GitHub Actions](https://github.com/features/actions) — integração contínua

## 📁 Estrutura do Projeto

```
fintrack/
├── src/
│   ├── index.js        # Ponto de entrada CLI
│   ├── financas.js     # Lógica de negócio
│   ├── storage.js      # Persistência em JSON
│   └── display.js      # Formatação de saída
├── tests/
│   └── financas.test.js
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── package.json
└── README.md
```

## 🚀 Instalação

**Pré-requisitos:** Node.js v20 ou superior.

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/fintrack.git
cd fintrack

# Instale as dependências
npm install
```

## ▶️ Execução

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

**Despesas:** `assinatura`, `lazer`, `estacionamento`, `alimentacao`, `saude`, `educacao`, `moradia`, `transporte`, `outros`

## 🧪 Testes

```bash
npm test
```

Os testes cobrem:
- ✅ Caminho feliz (fluxo correto de uso)
- ❌ Entradas inválidas (valor negativo, zero, texto, descrição vazia, categoria inválida)
- 🔲 Casos limite (mês sem dados, resultado negativo, ID inexistente)

## 🔍 Lint

```bash
npm run lint
```

Utiliza **ESLint** para verificar estilo e qualidade do código.

## ⚙️ CI — GitHub Actions

O pipeline executa automaticamente a cada `push` e `pull_request` na branch `main`:

1. Checkout do repositório
2. Setup do Node.js (versões 20 e 22)
3. Instalação de dependências (`npm ci`)
4. Lint (`npm run lint`)
5. Testes (`npm test`)

## 🖥️ Interface Gráfica (GUI)

O FinTrack conta com uma interface web completa construída em **React + Vite**, conectada a um servidor **Express** via endpoints REST.

### Iniciando o backend

```bash
# Na raiz do projeto
npm install
npm run server
# Servidor rodando em http://localhost:3001
```

### Iniciando o frontend

```bash
# Em outro terminal, na raiz do projeto
cd client
npm install
npm run dev
# Interface disponível em http://localhost:5173
```

### Funcionalidades da GUI

- **Dashboard** — resumo do mês (total de entradas, despesas e resultado), gráfico de pizza com despesas por categoria e seletor de mês
- **Lançamentos** — formulários para adicionar entradas e despesas, tabela com todos os lançamentos do mês e botão de remoção individual

### Endpoints da API REST

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/entradas` | Adicionar entrada |
| POST | `/api/despesas` | Adicionar despesa |
| GET | `/api/entradas?mes=` | Listar entradas |
| GET | `/api/despesas?mes=` | Listar despesas |
| GET | `/api/resumo?mes=` | Resumo mensal |
| DELETE | `/api/entradas/:id` | Remover entrada |
| DELETE | `/api/despesas/:id` | Remover despesa |

### Estrutura adicionada

```
fintrack/
├── src/
│   └── server.js       # Servidor Express com API REST
├── client/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── Dashboard.jsx
│   │       └── Lancamentos.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── REQUISITOS.md       # Checklist dos requisitos da atividade
```

## 📌 Versão

**1.0.0** — Veja o [CHANGELOG](./CHANGELOG.md) para o histórico de mudanças.

## 👤 Autor

**Italo**  
Repositório: [https://github.com/SEU_USUARIO/fintrack](https://github.com/SEU_USUARIO/fintrack)
